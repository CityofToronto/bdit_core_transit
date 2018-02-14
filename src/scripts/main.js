// The main javascript file for bdit_core_transit.

$(function () {
  //Use this as the main starting point for your application javascript.
  //Don't forget you can use preprocessor variables in your javascript for control logic and printing out variables.
  //You can do even more complex things too, check out https://github.com/jsoverson/preprocess#directive-syntax

  //create a new application object:
  let app = new SampleApp('bdit_core_transit');

  //@if !IS_EMBEDDED
  app.setBreadcrumb([ //only standalone apps set their own breadcrumb
    {"name": "bdit_core_transit", "link": "#"}
  ]);
  //@endif

  app.render(); //render the application

});
