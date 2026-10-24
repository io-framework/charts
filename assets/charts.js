// io-charts: one tooltip per chart listing every series at the hovered or
// focused x position, a crosshair on line charts, and arrow-key navigation.
// Values come from the chart's own data table (textContent, never markup), so
// the picture and the tooltip can never disagree.
(() => {
    const figureOf = (el) => el.closest('[io-chart]');

    const tooltip = (figure) => {
        let tip = figure.querySelector('.io-chart-tooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'io-chart-tooltip';
            tip.setAttribute('role', 'status');
            tip.hidden = true;
            figure.querySelector('.io-chart-plot').appendChild(tip);
        }
        return tip;
    };

    const data = (figure) => {
        const names = Array.from(figure.querySelectorAll('.io-chart-table thead th')).slice(1).map((th) => th.textContent);
        const rows = Array.from(figure.querySelectorAll('.io-chart-table tbody tr')).map((tr) => ({
            label: tr.querySelector('th').textContent,
            values: Array.from(tr.querySelectorAll('td')).map((td) => td.textContent),
        }));
        return { names, rows };
    };

    const show = (hit) => {
        const figure = figureOf(hit);
        if (!figure) return;
        const index = Number(hit.getAttribute('data-index'));
        const { names, rows } = data(figure);
        const row = rows[index];
        if (!row) return;

        const tip = tooltip(figure);
        tip.replaceChildren();
        const head = document.createElement('div');
        head.className = 'io-chart-tooltip-label';
        head.textContent = row.label;
        tip.appendChild(head);
        row.values.forEach((value, j) => {
            const line = document.createElement('div');
            line.className = 'io-chart-tooltip-row';
            const key = document.createElement('span');
            key.className = `io-chart-tooltip-key io-chart-series-${j + 1}`;
            const strong = document.createElement('strong');
            strong.textContent = value;
            const name = document.createElement('span');
            name.textContent = names[j] ?? '';
            line.append(key, strong, name);
            tip.appendChild(line);
        });

        const plot = figure.querySelector('.io-chart-plot').getBoundingClientRect();
        const box = hit.getBoundingClientRect();
        tip.hidden = false;
        const x = Math.max(4, Math.min(box.left - plot.left + box.width / 2 - tip.offsetWidth / 2, plot.width - tip.offsetWidth - 4));
        tip.style.left = `${x}px`;
        tip.style.top = '8px';

        for (const mark of figure.querySelectorAll('.io-chart-mark, .io-chart-marker')) {
            mark.classList.toggle('is-active', mark.getAttribute('data-index') === String(index));
        }
        const crosshair = figure.querySelector('.io-chart-crosshair');
        if (crosshair) {
            const cx = Number(hit.getAttribute('x')) + Number(hit.getAttribute('width')) / 2;
            crosshair.setAttribute('x1', cx);
            crosshair.setAttribute('x2', cx);
            crosshair.classList.add('is-active');
        }
    };

    const hide = (hit) => {
        const figure = figureOf(hit);
        if (!figure) return;
        tooltip(figure).hidden = true;
        for (const mark of figure.querySelectorAll('.is-active')) mark.classList.remove('is-active');
    };

    // The script takes over from the native <title> tooltips.
    const takeOver = () => {
        for (const title of document.querySelectorAll('[io-chart-hit] > title')) title.remove();
    };

    Io.directive('io-chart-hit', 'pointerover', (el) => show(el));
    Io.directive('io-chart-hit', 'pointerout', (el) => hide(el));
    Io.directive('io-chart-hit', 'focusin', (el) => show(el));
    Io.directive('io-chart-hit', 'focusout', (el) => hide(el));
    Io.directive('io-chart-hit', 'keydown', (el, event) => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        const hits = Array.from(figureOf(el).querySelectorAll('[io-chart-hit]'));
        const next = hits[hits.indexOf(el) + step];
        if (next) {
            event.preventDefault();
            next.focus();
        }
    });
    takeOver();
})();
