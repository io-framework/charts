<?php

namespace Io\Charts\Tests;

use Io\Charts\ChartsPlugin;
use Io\Options\RendererOptions;
use Io\Testing\TestCase;

final class PluginTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $app = $this->app();
        $app->plugin(new ChartsPlugin());
        $app->configure(function (RendererOptions $opts) {
            $opts->directory = __DIR__ . '/views';
        });
        $app->attach([ChartsController::class]);
    }

    public function testAChartReturnedFromARouteIsAnSvgImage(): void
    {
        $this->get('/report.svg')
            ->assertOk()
            ->assertContentType('image/svg+xml')
            ->assertSee('<svg xmlns=')
            ->assertSee('<title id="wpc')
            ->assertDontSee('<figure');
    }

    public function testTheViewHelperRendersTheFigureAndTheAssetsAreServed(): void
    {
        $page = $this->get('/page')->assertOk()->assertSee('<figure class="io-chart io-chart-bar"')->assertSee('io-chart-details');
        preg_match('#href="(/assets/charts\.charts\.[0-9a-f]{12}\.css)"#', $page->body(), $css);
        preg_match('#src="(/assets/charts\.charts\.[0-9a-f]{12}\.js)"#', $page->body(), $js);

        $this->get($css[1])->assertOk()->assertContentType('text/css')->assertSee('--io-chart-series-1: #2a78d6');
        $this->get($js[1])->assertOk()->assertSee("Io.directive('io-chart-hit'");
    }
}
