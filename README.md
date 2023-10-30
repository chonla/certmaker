# Cert Maker

A PDF certificate maker

## Usage

Make a call to `https://certmaker.deno.dev` with custom parameters.

## Parameters

| Name | Description |
| --- | --- |
| recipient | Name written on the certificate. 'Recipient's Name' if omitted. |
| font | Google font name to be used for recipient's name. 'Noto Sans Thai Looped' if omitted. |
| template | Certificate background image name with A4 paper size in png format. Blank template if omitted. A4 paper size is 8.27 x 11.69 inches. |
| fontsize | Font size **in inch**. 0.5 if omitted. |
| fontcolor | Font color **RGB in RRGGBB format**. 000000 if omitted, Black. |
| x | Horizontal position of recipient's name **in inch**, measured from left. Center if omitted. |
| y | Vertical position of recipient's name **in inch**, measured from bottom. Center if omitted. |

## Cert Maker Application

https://chonla.github.io/certmaker/

## API Example

### On Deno Deploy

```
https://certmaker.deno.dev?recipient=Chonlasith+Jucksriporn&y=4.25&fontsize=0.5&marginleft=3.78&template=playwright-hands-on-cert&fontcolor=ff0000
```

### On localhost

```
http://localhost?recipient=Chonlasith+Jucksriporn&y=4.25&fontsize=0.5&marginleft=3.78&template=playwright-hands-on-cert&fontcolor=ff0000
```