---
title: "ChartsPlugin"
description: "Register with `$app->plugin(new ChartsPlugin())`."
order: 100
generated: true
---

`Io\Charts\ChartsPlugin` · final class · namespace [`Io\Charts`](index.md)

```php
final class ChartsPlugin extends \Io\Plugin\PluginBase implements \Io\Plugin\ClientAsset, \Io\Plugin\Renderer, \Io\Plugin\ViewHelper
```

Extends `Io\Plugin\PluginBase`  
Implements `Io\Plugin\ClientAsset`, `Io\Plugin\Renderer`, `Io\Plugin\ViewHelper`

Register with `$app->plugin(new ChartsPlugin())`. Adds `$this->chart($chart)`
to templates, renders a Chart returned from a route as image/svg+xml, and
ships the stylesheet and the tooltip script.

## Methods

### name()

```php
public function name(): string
```

Short unique name ('i18n'): the plan namespace for its route data, and the prefix in logs.

**Returns** `string`

### boot()

```php
public function boot(\Io\Container $container, \Io\Charts\ChartsOptions $options): void
```

**Parameters**

- `$container` `\Io\Container`
- `$options` [`ChartsOptions`](ChartsOptions.md)

### hooks()

```php
public function hooks(): array
```

**Returns** `list<object>`: Instances of Endpoint, Fallback, RouteAttributeCompiler, Guard, ResponseHook, ArgumentBinder, Renderer, OpenApiExtension, ViewHelper, ClientAsset.

### helpers()

```php
public function helpers(): array
```

**Returns** `array<string, callable>`: name => callable

### supports()

```php
public function supports(mixed $result): bool
```

**Parameters**

- `$result` `mixed`

**Returns** `bool`

### render()

```php
public function render(mixed $result, \Io\Http\Request $req, \Io\Http\Response $res): void
```

**Parameters**

- `$result` `mixed`
- `$req` `\Io\Http\Request`
- `$res` `\Io\Http\Response`

### assets()

```php
public function assets(): array
```

**Returns** `array<string, string>`: {logical filename ending in .css or .js => absolute source path}
