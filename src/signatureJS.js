/*jslint nomen:true */
/*globals jQuery, document */
(function ($) {
    /*  
        SignatureJS Ver: 1.0
        SignatureJS is a jQuery plugin which provides an interface for
        the user to Sign. This plugin is based on HTML 5 Canvas.
        --------------------------------------------------------------
        Created by: Shrisha Bayari, shrisha.sb@gmail.com
    */
    "use strict";
    var SignatureJS = function () {},
        _SignatureJS = SignatureJS.prototype,
        html = {
            no_float: "<div style='clear:both'></div>",
            button: "<p class='sjs-butn-wrap'><span class='sjs-butn sjs-done'>Save</span><span class='sjs-butn sjs-clear'>Clear</span></p>"
        };
    /*
        Signature function will draw the signature along the stored path.
        (x and y coordinates) W.R.T. clicked or dragged position.
    */
    _SignatureJS.signature = function () {
        var self         = this,
            context      = self.options.context,
            posi_x       = self.options.position_x,
            posi_y       = self.options.position_y,
            click_drag   = self.options.click_drag,
            marker_color = self.options.marker_color || "#000000",
            marker_size  = self.options.marker_size || 2,
            tip;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // Set the background color to white. To avoid transparency property of canvas.
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        // Linejoin property set to round.
        context.lineJoin = "round";
        // Set the marker tip size. Default size is 2
        context.lineWidth = marker_size;
        // Set the marker tip color. Default color is Black
        context.strokeStyle = marker_color;
        for (tip = 0; tip < posi_x.length; tip += 1) {
            context.beginPath();
            if (click_drag[tip] && tip) {
                context.moveTo(posi_x[tip - 1], posi_y[tip - 1]);
            } else {
                context.moveTo(posi_x[tip] - 1, posi_y[tip]);
            }
            context.lineTo(posi_x[tip], posi_y[tip]);
            context.closePath();
            // Draw the signature
            context.stroke();
        }
    };
    /*
        GenerateCanvasData function check whether the signature is done or not.
        If done, It extracts the data url of the signed canvas and send it back.
    */
    _SignatureJS.generateCanvasData = function (element) {
        var self = this, context = self.options.context;
        if (self.options.is_signed) {
            // Hide the clear and save buttons if signature is done.
            //element.parents(".sjs-butn-wrap").hide();
             if (self.options.buttons && self.options.buttons.save && self.options.buttons.save.callback) {
                if (typeof self.options.buttons.save.callback === "function") {
                    self.options.buttons.save.callback(context.canvas.toDataURL());
                }
            } else {
                if (self.options.sign_data && typeof self.options.sign_data === "function") {
                    self.options.sign_data(context.canvas.toDataURL());
                }
            }
        }
    };
    /*
        Erase function will clear the stored coordinates and clear the canvas
    */
    _SignatureJS.erase = function () {
        var self = this, context = self.options.context;
        self.options.position_x = [];
        self.options.position_y = [];
        self.options.click_drag = [];
        // Clears the canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // Set the is_signed to false. is_signed helps to check whether a signature is done or not
        self.options.is_signed = false;
    };
    /*
        RegisterClickedPosi function will store the coordinates required.
        Mouse cursor path to draw the signature.
    */
    _SignatureJS.registerClickedPosi = function (x, y, drag) {
        var self = this;
        self.options.position_x.push(x);
        self.options.position_y.push(y);
        self.options.click_drag.push(drag);
    };
    /*
        Mousedown event will check for clicked button and stores the clicked coordinates.
        Call the signature function to draw the signature after storing the points.
    */
    _SignatureJS.mousedown = function (e) {
        var self = this, canvas = $(e.target);
        // enable drawing only for mouse left button
        if (e.which === 1) {
            self.options.sign = true;
            // Get the clicked location (x, y coordinates) from left top corner of canvas
            self.registerClickedPosi(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
            // Call the function to draw the signature
            self.signature();
        }
    };
    /*
        Mousemove event will store mouse movement points and then call the signature function
        to draw the signature according to registered points.
    */
    _SignatureJS.mousemove = function (e) {
        var self = this, canvas = $(e.target);
        if (self.options.sign) {
            // Get the mouse movement location (x, y co-ordinates) from left top corner of canvas
            self.registerClickedPosi(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top, true);
            // Set the is_signed to true. is_signed helps to check whether a signature is done or not
            self.options.is_signed = true;
            // Call the function to draw the signature
            self.signature();
        }
    };
    /*
        Touchstart event is for tocuh devces, This event will be triggered when canvas is touched
    */
    _SignatureJS.touchstart = function (e) {
        var self = this, canvas;
        if (e.touches) {
            // To ensure single touch
            if (e.touches.length === 1) {
                self.options.sign = true;
                // Get the information for finger #1
                e      = e.touches[0];
                canvas = $(e.target);
                // Get the tocuhed location (x, y co-ordinates) from left top corner of canvas
                self.registerClickedPosi(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                // Call the function to draw the signature
                self.signature();
            }
        }
    };
    /*
        Touchmove event will store the touched position points and draw the signature.
    */
    _SignatureJS.touchmove = function (e) {
        var self = this, canvas = $(e.target);
        if (self.options.sign) {
            if (e.touches) {
                // To ensure single touch
                if (e.touches.length === 1) {
                    // Get the information for finger #1
                    e      = e.touches[0];
                    canvas = $(e.target);
                    // Get the tocuhed location (x, y co-ordinates) from left top corner of canvas
                    self.registerClickedPosi(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top, true);
                    // Set the is_signed to true. is_signed helps to check whether a signature is done or not
                    self.options.is_signed = true;
                    // Call the function to draw the signature
                    self.signature();
                }
            }
        }
    };
    /*
        Initial setup for the plugin. Init function will create the canvas
        to draw the signature, and bind the required events for the plugin.
    */
    _SignatureJS.init = function (selector) {
        var self, element, canvas, save, clear;
        element = selector;
        self    = this;
        element.addClass("sjs-wrap");
        // Create the canvas element.
        canvas = document.createElement("canvas");
        // Set the height and width for the canvas.
        canvas.setAttribute("width", self.options.width || 400);
        canvas.setAttribute("height", self.options.height || 160);
        // Append created canvas element to the required element.
        element.empty().append(canvas);
        element.append(html.no_float);
        // Append the button required to say done or clear the canvas.
        if (!self.options.buttons) {
            element.append(html.button);
        }
        // Select the required element to bind the required events.
        canvas  = $(canvas);
        self.options.context = canvas[0].getContext("2d");
        // Bind the events required for the plugin
        // Mousedown event to register the clicked position
        canvas.on("mousedown", function (e) {
            self.mousedown(e);
        });
        // Mousedown event to register the mouse position while moving on canvas.
        canvas.on("mousemove", function (e) {
            self.mousemove(e);
        });
        // When the mouse button is moved up, Disable signature.
        canvas.on("mouseup", function () {
            self.options.sign = false;
        });
        // When the mosue move out of the canvas, Disable the signature.
        canvas.on("mouseleave", function () {
            self.options.sign = false;
        });
        // Touch events
        canvas[0].addEventListener("touchstart", function (e) {
            self.touchstart(e);
        });
        canvas[0].addEventListener("touchmove", function (e) {
            self.touchmove(e);
            e.preventDefault();
        });
        canvas[0].addEventListener("touchend", function () {
            self.options.sign = false;
        });
        // Click event to clear the signature canvas.
        if (self.options.buttons && self.options.buttons.clear) {
            clear = self.options.buttons.clear.selector;
            clear.on("click", function () {
                self.erase();
            });
        } else {
            element.find(".sjs-clear").on("click", function () {
                self.erase();
            });
        }
        // click event to generate data-url of the image and send it back.
        if (self.options.buttons && self.options.buttons.save) {
            save = self.options.buttons.save.selector;
            save.on("click", function () {
                self.generateCanvasData($(this));
            });
        } else {
            element.find(".sjs-done").on("click", function () {
                self.generateCanvasData($(this));
            });
        }
    };
    /*
        Defining the nwe jQuery plugin signatureJS.
    */
    $.fn.signatureJS = function (options) {
        return this.each(function () {
            var instance = new SignatureJS();
            options = options || {};
            if (options) {
                instance.options = $.extend(true, {
                    selector   : $(this),
                    sign       : false,
                    is_signed  : false,
                    context    : "",
                    position_x : [],
                    position_y : [],
                    click_drag : []
                }, options);
            }
            instance.init($(this));
        });
    };
}(jQuery));