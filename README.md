<p align="center"><img alt="Logo" src="https://res.cloudinary.com/dkgtd3pil/image/upload/e_bgremoval,o_100/v1587389258/other_data/Screenshot_21.png"></p>
<p align="center">
<a href="https://npmjs.com/package/@dopesky/infiscroll"><img alt="npm (scoped)" src="https://img.shields.io/npm/v/@dopesky/infiscroll?logo=npm"></a>
<a href="https://github.com/dopesky/infiscroll/actions?query=workflow%3Abuild"><img src="https://github.com/dopesky/infiscroll/workflows/build/badge.svg?branch=2.0.0" alt="Build Status"></a>
<a href='https://coveralls.io/github/dopesky/infiscroll?branch=master'><img src='https://coveralls.io/repos/github/dopesky/infiscroll/badge.svg' alt='Coverage Status' /></a>
<a href="https://github.com/dopesky/infiscroll/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors-anon/dopesky/infiscroll"></a>
<a href="https://github.com/dopesky/infiscroll/blob/master/LICENSE"><img src="https://img.shields.io/github/license/dopesky/infiscroll" alt="License"></a>
<a href="https://github.com/dopesky/infiscroll/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/dopesky/infiscroll?label=issues"></a>
<a href="https://gitter.im/infiscroll/community"><img src="https://img.shields.io/badge/chat-on%20gitter-e91e63.svg?logo=gitter" alt="Chat on Gitter"></a>
</p>

## About Infiscroll

Infiscroll is a class containing utility functions that enable you to:

- Launch toasts with the help of [Bootstrap:](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- Display form errors and toggle disabled state for buttons effortlessly, with help from [jQuery](https://jquery.com).
- Locale Specific Capitalization that is easily customizable.
- JSON stringify and parse functions with quotes escaping.
- Convert any valid datetime string to User's timezone from Server's timezone, with help from [moment](https://momentjs.com).
- Perform Reveal on Scroll animations and Image Lazy Loading by just calling one function.
- Process Ajax requests and handle Ajax Errors, built to work with [laravel framework](https://laravel.com) with minimal configuration.
- Create Admin Pages with CRUD functionality, with help from [DataTables.](https://datatables.net/download/)
- Launch Infinite Scroll on a page with just one function call.

**Note:** Every infiscroll ``variable`` is overridable by passing your alternative in the constructor. The Infiscroll class is available on the global scope or in the window object for browsers.

## Getting Started

Include the following in your html after JQuery, Bootstrap and DataTables CSS and JS files:
```
https://unpkg.com/@dopesky/infiscroll@2.0.0/dist/css/infiscroll.css

https://unpkg.com/@dopesky/infiscroll@2.0.0/dist/js/infiscroll.js
```

**Note:** The product is currently on [Node Package Registry](https://npmjs.com/@dopesky/infiscroll) and [GitHub Package Registry](https://github.com/dopesky/infiscroll/packages/228073). Therefore, you can also install the whole project by running: 
```
npm install @dopesky/infiscroll
```
You might need to also install the other dependencies (jQuery and Co.) too.  
  
The full documentation with samples is available [here](https://infiscroll.herokuapp.com).


## Dependencies

Infiscroll requires the following additional libraries to work effectively:
- [JQuery](https://jquery.com) - **Crucial**
- [DataTables](https://datatables.net) - **Semi Crucial** (Only if you require crud functionality, or an easier way of creating dataTables)
- [Bootstrap >= v4.2](https://bootstrap.com) - **Optional** (If you will be using toasts in any way, including in ajax error handling. Most of the library's css is also built to work side by side with bootstrap).
- [Moment](https://momentjs.com) - **Optional** (If you will be working with time and need to convert server time to user time).

## Issues

If your find any issues within the project raise them [here](https://github.com/dopesky/infiscroll/issues/new) and remember to label them accordingly to make it easier for me to address them. Also, before raising an issue ensure that no related issue already exists. Thanks :)

## Contributing

Thank you for considering contributing to the Infiscroll helper/library! To contribute:
- Fork your own copy of the project and make any changes/fixes you deem fit.
- If you are proposing a new feature, please create a new feature branch with the name prefixed `feature-`
- Ensure You write ``tests`` for your patches/features and make sure Your tests run successfully.
- Document your changes in the ``docs`` folder of the project.
- Make a pull request to the master repo and wait for feedback :)

A good place to start would be at the [issues](https://github.com/dopesky/infiscroll/issues) page. Ensure before raising a new issue that no related issue already exists.

## Code of Conduct

In order to ensure that the Infiscroll community is welcoming to all, please review and abide by the Code of Conduct below:

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behavior that can be reasonably considered harassment will not be tolerated.

## Security Vulnerabilities

If you discover a security vulnerability within Infiscroll, please send an e-mail to Kevin Mwenda via [oboke69@gmail.com](mailto:oboke69@gmail.com). All security vulnerabilities will be promptly addressed.

## License

Infiscroll is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
