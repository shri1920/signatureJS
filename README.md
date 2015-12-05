# signatureJS

SignatureJS is jQuery plugin built on top of HTML5 Canvas, A front end tool for signature. It works with both desktop and mobile browser

## Installation

Download the latest release from GitHub [releases page](https://github.com/shri1920/signatureJS/releases).


## Usage

```javascript
    $(".sign-container").signatureJS({
        height       : 160,
        width        : 400,
        marker_color : "#000000",
        marker_size  : 2,
        sign_data    : function (data_url) {
        } 
    });
```
## Options

#### height
To set the height of the interface (Signature canvas). If not set canvas will be set with a default height (160).

#### width
To set the width of the interface (Signature canvas). If not set canvas will be set with a default width (400).

#### marker_color
To set the color of marker. If not set signature will be drawn with default (Black) color.

#### marker_size
To set the thickness of marker. If not set a default value (2) will be considered as marker size.

#### sign_data
A Function which will be called when the user is done with signature. Data url of signature canvas as a parameter for the function.
