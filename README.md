# Cert Maker

A PDF certificate maker

## Usage

Make a call to `https://certmaker.deno.dev` with custom parameters.

## Parameters

| Name | Description |
| --- | --- |
| recipient | Name written on the certificate. 'Recipient's Name' if omitted. |
| font | Google font name to be used for recipient's name. 'Noto Sans Thai Looped' if omitted. |
| template | Certificate background image name in png format. Blank template if omitted. |
| fontsize | Font size **in inch**. 0.5 if omitted. |
| x | Horizontal position of recipient's name **in inch**, measured from left. Center if omitted. |
| y | Vertical position of recipient's name **in inch**, measured from bottom. Center if omitted. |

## Example

```
https://certmaker.deno.dev?recipient=Chonlasith+Jucksriporn&y=3
```