require('@babel/polyfill');
const {describe, it, before} = require("mocha");
const chai = require('chai');
const should = chai.should();
let isIntersecting = true;
prepareEnvironmentForTesting();
const {infiscroll} = require('../src/js/infiscroll');

function prepareEnvironmentForTesting() {
    global['IntersectionObserver'] = class IntersectionObserver {
        constructor(callback) {
            this.callback = callback
        }

        observe(target) {
            target['isIntersecting'] = isIntersecting;
            target['target'] = target;
            return this.callback([target], this);
        }

        unobserve() {
            return null;
        }
    };
    global['jsdom'] = require('jsdom');
    global['moment'] = require('moment');
}

function shouldNotBeClickableElement(variable) {
    it('Should be a string', () => {
        variable.should.be.a('string');
    })

    it('Should not contain a button or anchor tag', () => {
        variable.indexOf('button').should.equal(-1);
        variable.indexOf('href').should.equal(-1);
    })
}

function shouldExplicitlyBeSubmitButton(variable) {
    it('Should be a string', () => {
        variable.should.be.a('string');
    })

    it('Should Explicitly be a Submit Button', () => {
        variable.indexOf('button').should.not.equal(-1, "Variable does not Create a button");
        variable.indexOf('type="submit"').should.not.equal(-1, "Created button is not explicitly a submit button");
    })
}

function shouldExplicitlyNotBeSubmitButton(variable) {
    it('Should be a string', () => {
        variable.should.be.a('string');
    })

    it('Should Explicitly be a Button that is not a Submit Button', () => {
        variable.indexOf('button').should.not.equal(-1, "Variable does not Create a button");
        variable.indexOf('type="button"').should.not.equal(-1, "Created button is not explicitly of type \"button\"");
    })
}

describe('Variable Testing', () => {
    describe('Valid Toast Types', () => {
        it('Should be an Object with the Relevant Keys (success, danger, warning, info)', () => {
            infiscroll.validToastTypes.should.be.a('object').with.keys(["success", "danger", "warning", "info"]);
        })
    })

    describe('Infinite Scroll Object', () => {
        it('Should be an object with the relevant Keys', () => {
            infiscroll.infiniteScrollObject.should.be.a('object').with.keys(['ajax', 'hasMoreItems', 'newItems', 'size', 'offset', 'fetching']);
        })

        describe('@Ajax', () => {
            it('Should be an empty Object', () => {
                infiscroll.infiniteScrollObject.ajax.should.eql({});
            })
        })

        describe('@Size', () => {
            it('Should be -1', () => {
                infiscroll.infiniteScrollObject.size.should.equal(-1);
            })
        })

        describe('@New Items', () => {
            it('Should be 0', () => {
                infiscroll.infiniteScrollObject.newItems.should.equal(0);
            })
        })

        describe('@Has More Items', () => {
            it('Should be true', () => {
                infiscroll.infiniteScrollObject.hasMoreItems.should.equal(true);
            })
        })

        describe('@Offset', () => {
            it('Should be 0', () => {
                infiscroll.infiniteScrollObject.offset.should.equal(0);
            })
        })

        describe('@Fetching', () => {
            it('Should be false', () => {
                infiscroll.infiniteScrollObject.fetching.should.equal(false);
            })
        })
    });

    describe('DataTable Edit Button', () => {
        shouldNotBeClickableElement(infiscroll.dataTableEditButton);
    })

    describe('DataTable Restore Button', () => {
        shouldNotBeClickableElement(infiscroll.dataTableRestoreButton);
    })

    describe('DataTable Delete Button', () => {
        shouldNotBeClickableElement(infiscroll.dataTableDeleteButton);
    })

    describe('DataTable Loading Button', () => {
        shouldNotBeClickableElement(infiscroll.dataTableButtonLoadingHtml);
    })

    describe('Register Ajax Button', () => {
        shouldExplicitlyBeSubmitButton(infiscroll.buttonHtmlAdd);
    })

    describe('Update Ajax Button', () => {
        shouldExplicitlyBeSubmitButton(infiscroll.buttonHtmlEdit);
    })

    describe('Cancel Update Button', () => {
        shouldExplicitlyNotBeSubmitButton(infiscroll.buttonHtmlCancel);

        it('Should have a an onclick listener set to setEditData() function', () => {
            infiscroll.buttonHtmlCancel.indexOf('onclick="setEditData()"').should.not.equal(-1, "Valid onclick Listener Not Found");
        })
    })

    describe('Loading Button', () => {
        shouldNotBeClickableElement(infiscroll.buttonLoadingHtml);
    })

    describe('Load More Button', () => {
        it('Should be a string', () => {
            infiscroll.buttonLoadMoreHtml.should.be.a('string');
        })

        it('Should contain a button tag', () => {
            infiscroll.buttonLoadMoreHtml.indexOf('button').should.not.equal(-1, "Variable does not initialize a button element.");
        })
    })

    describe('Loading More Button', () => {
        shouldNotBeClickableElement(infiscroll.buttonLoadMoreLoadingHtml)
    })

    describe('Page State', () => {
        it('Should explicitly be equal to "add"', () => {
            infiscroll.pageState.should.be.a('string');
            infiscroll.pageState.should.equal('add');
        })
    })
})


describe('Function Testing', () => {
    before('Prepare DOM for Testing', () => {
        global['dom'] = new jsdom.JSDOM(`<!DOCTYPE html><html lang="en"><head><title>Test DOM</title></head><body></body></html>`, {
            runScripts: "dangerously",
            resources: "usable"
        });
        global['$'] = require('jquery')(dom.window);
        global['window'] = dom.window;
        global['document'] = window.document;
        global['navigator'] = {language: 'en'};
        global['FormData'] = class FormData {
            constructor(form) {
                let entries = $(form).find('input');
                let returnValue = {};
                for (let i = 0; i < entries.length; i++) {
                    returnValue[entries[i].name] = entries[i].value
                }
                return returnValue;
            }
        };
        let body = $('body');
        body.append("<div class='show-on-scroll'></div>");
        body.append("<button id='test-toggle-button'></button>");
        body.append("<div class='page-title' data-add='Add' data-edit='Edit'></div><form><input type='text' name='ok' value='1'><input type='text' name='error'><button>Submit</button></form>");
        body.append("<img src='https://source.unsplash.com/random' alt='Dummy' class='lazy-load-image' data-src='https://source.unsplash.com/random' data-srcset='elva-fairy-480w.jpg 480w, elva-fairy-800w.jpg 800w'>");
        body.append("<div class='lazy-load' data-src='https://source.unsplash.com/random'></div>");
        $.fn.toast = () => {
            return true;
        };
        $.fn.DataTable = (options) => {
            let full = {
                id: 1,
                name: 'Kevin',
                email: 'oboke69@gmail.com',
                suspended: false
            };
            let columnDefs = options.columnDefs;
            columnDefs.forEach(columnDef => {
                if (columnDef.hasOwnProperty('render')) columnDef.render(full.id, 'display', full);
            })
            return true;
        };
        $.ajax = ({data}) => Object.keys(data).length === 1 && data.id ? Promise.resolve(infiscroll.parse(data.id)) : Promise.resolve(data);
        window.jQuery.fn.dataTable = {
            Buttons: {
                defaults: {
                    dom: {
                        container: {}
                    }
                }
            },
            ext: {
                classes: {}
            },
            Api: class Api {
                constructor() {
                    return {ajax: {reload: () => true}}
                }
            }
        };
    })

    describe('Set Toast Function', () => {
        it('Should Return True if Correct Parameters are Passed', () => {
            infiscroll.setToast({type: 'danger'}).should.equal(true);
            infiscroll.setToast([{type: 'success'}, {type: 'info'}]).should.equal(true);
            infiscroll.setToast({}).should.equal(true);
        })

        it('Should Return False or Throw Error if Wrong Parameters are Passed', () => {
            should.throw(() => infiscroll.setToast(), TypeError);
            infiscroll.setToast([]).should.equal(false);
            infiscroll.setToast({type: 'error'}).should.equal(false);
        })
    })

    describe('Toggle Button Function', () => {
        it('Should Return True if Correct Parameters are Passed', () => {
            infiscroll.toggleButton({button: '#test-toggle-button'}).should.equal(true);
            infiscroll.toggleButton({button: '#test-toggle-button'}).should.equal(true);
            infiscroll.toggleButton([{button: '#test-toggle-button-1'}, {button: '#test-toggle-button-2'}]).should.equal(true);
        })

        it('Should Return False or Throw Error if Wrong Parameters are Passed', () => {
            should.throw(() => infiscroll.toggleButton(), TypeError);
            infiscroll.toggleButton({}).should.equal(false);
            infiscroll.toggleButton([]).should.equal(false);
        })
    })

    describe('Set Form Errors Function', () => {
        it('Should Return True if Error Div was added to DOM', () => {
            infiscroll.setFormErrors(['Kevin is an error']).should.equal(true);
            infiscroll.setFormErrors('Kevin is an error').should.equal(true);
        })

        it('Should Return False if Error Div was hidden in DOM', () => {
            infiscroll.setFormErrors().should.equal(false);
            infiscroll.setFormErrors('').should.equal(false);
            infiscroll.setFormErrors([]).should.equal(false);
        })
    })

    describe('Capitalize Function', () => {
        it('Should Capitalize Correctly', () => {
            infiscroll.capitalize('PHP MySql').should.equal('Php Mysql');
            infiscroll.capitalize('PHP').should.equal('Php');
            infiscroll.capitalize(false).should.equal('');
            infiscroll.capitalize(' ').should.equal('');
            infiscroll.capitalize('italy', 'tr').should.not.equal('Italy');
        })
    })

    describe('Stringify Function', () => {
        it('Should Successfully Escape Quotes from Stringified String Input', () => {
            infiscroll.stringify("Ng'ang\"a").should.be.equal('"Ng~ang`a"');
        })

        it('Should Successfully Stringify Numerical Input', () => {
            infiscroll.stringify(12).should.be.equal('12');
        })

        it('Should Successfully Stringify Boolean Input', () => {
            infiscroll.stringify(true).should.be.equal('true');
        })

        it('Should Successfully Escape Quotes from Stringified Object Input', () => {
            infiscroll.stringify({}).should.be.equal('{}');
            infiscroll.stringify({name: "Ng'ang\"a"}).should.be.equal('{"name":"Ng~ang`a"}');
            infiscroll.stringify({name: ["Ng'ang\"a", "Word"]}).should.be.equal('{"name":["Ng~ang`a","Word"]}');
        })

        it('Should Successfully Escape Quotes from Stringified Array Input', () => {
            infiscroll.stringify(["Ng'ang\"a", "Word"]).should.be.equal('["Ng~ang`a","Word"]');
            infiscroll.stringify([{name: "Ng'ang\"a"}, {name: "Word"}]).should.be.equal('[{"name":"Ng~ang`a"},{"name":"Word"}]')
        })
    })

    describe('Parse Function', () => {
        it('Should Successfully Revert Escaped Quotes from Stringified String Input', () => {
            infiscroll.parse('"Ng~ang`a"').should.be.equal("Ng'ang\"a");
        })

        it('Should Successfully Revert Stringified Numerical Input', () => {
            infiscroll.parse('12').should.be.equal(12);
        })

        it('Should Successfully Revert Stringified Boolean Input', () => {
            infiscroll.parse('true').should.be.equal(true);
        })

        it('Should Successfully Revert Escaped Quotes from Stringified Object Input', () => {
            infiscroll.parse('{}').should.be.eql({});
            infiscroll.parse({}).should.be.eql({});
            infiscroll.parse('{"name":"Ng~ang`a"}').should.be.eql({name: "Ng'ang\"a"});
            infiscroll.parse({name: "Ng~ang`a"}).should.be.eql({name: "Ng'ang\"a"});
            infiscroll.parse({name: ["Ng~ang`a", "Word"]}).should.be.eql({name: ["Ng'ang\"a", "Word"]});
        })

        it('Should Successfully Revert Escaped Quotes from Stringified Array Input', () => {
            infiscroll.parse('["Ng~ang`a","Word"]').should.be.eql(["Ng'ang\"a", "Word"]);
            infiscroll.parse(["Ng~ang`a", "Word"]).should.be.eql(["Ng'ang\"a", "Word"]);
            infiscroll.parse([{name: "Ng~ang`a"}, {name: "Word"}]).should.be.eql([{name: "Ng'ang\"a"}, {name: "Word"}])
        })
    })

    describe('Get Timezone Equivalent Date Function', () => {
        it('Should Transform Timezone Date to Local Equivalent Datetime', () => {
            infiscroll.getTimezoneEquivalentDate('2020-05-13 12:00:00', 0)
                .add((new Date()).getTimezoneOffset(), 'minutes').format('hh:mm:ss').should.be.equal('12:00:00');
        })

        it('Should reject Invalid dates', () => {
            infiscroll.getTimezoneEquivalentDate('2020-12-34').should.be.equal(false);
        })
    })

    describe('Initialize Scroll Animation Function', () => {
        it('Should Observe the Element to Reveal on Scroll', () => {
            infiscroll.initScrollAnimation().should.be.equal(true);
            isIntersecting = false;
            infiscroll.initScrollAnimation().should.be.equal(true);
            isIntersecting = true;
        })

        it('Should Return False if Element was Not Found', () => {
            infiscroll.initScrollAnimation('.infiscroll').should.be.equal(false);
        })
    })

    describe('Initialize Lazy Loading Function', () => {
        it('Should Observe the Element to Load Image on Page Scroll', () => {
            infiscroll.initLazyLoading().should.be.equal(true);
            infiscroll.initLazyLoading('.lazy-load-image').should.be.equal(true);
        })

        it('Should Return False if Element was Not Found', () => {
            infiscroll.initLazyLoading('.infiscroll').should.be.equal(false);
        })
    })

    describe('Initialize Infinite Scroll Function', () => {
        it('Should Init the Infinite Scroll Functionality', () => {
            infiscroll.initInfiniteScroll('https://jsonplaceholder.typicode.com/posts', () => {
                return {newItems: 200, hasMoreItems: false, offset: 20, size: 200};
            }, '.show-on-scroll').should.be.equal(true);
        })

        it('Should Return False if Wrong Url is Passed or no Targets are found', () => {
            infiscroll.initInfiniteScroll(false, (data) => data, '.show-on-scroll').should.be.equal(false);
            infiscroll.initInfiniteScroll('https://jsonplaceholder.typicode.com/posts', (data) => data, '.not-in-dom').should.be.equal(false);
        })
    })

    describe('Create DataTable Function', () => {
        it('Should Create a DataTable', () => {
            infiscroll.createDataTable({ajax: {}, isServerSide: true, processing: true}).should.be.equal(true);
            infiscroll.createDataTable({isCrud: false}).should.be.equal(true);
        })

        it('Should Fail to Create DataTable if Wrong Parameters are Passed', () => {
            should.Throw(() => infiscroll.createDataTable({}), TypeError);
        })
    })

    describe('Register Via Ajax Function', () => {
        it('Should Submit Forms to the Backend', (done) => {
            infiscroll.addAjax({hasImages: true}).then(data => {
                data.should.be.eql({ok: '1', error: ''});
                done();
            })
        })
    })

    describe('Edit Via Ajax Function', () => {
        it('Should Submit Forms to the Backend', (done) => {
            infiscroll.editAjax({}).then(data => {
                data.should.be.eql({ok: '1', error: ''});
                done();
            })
        })
    })

    describe('Delete Restore Data via Ajax Function', () => {
        it('Should Delete data to the Backend Successfully', (done) => {
            infiscroll.deleteRestore('#test-toggle-button', infiscroll.stringify({ok: 1}), true, '', 'table').then((data) => {
                data.should.be.eql({ok: 1});
                done();
            });
        })

        it('Should Restore data to the Backend Successfully', (done) => {
            infiscroll.deleteRestore('#test-toggle-button', infiscroll.stringify({ok: 1}), false, '', 'table').then((data) => {
                data.should.be.eql({ok: 1});
                done();
            });
        })

        it('Should Handle Any Errors Successfully', (done) => {
            infiscroll.deleteRestore('#test-toggle-button', infiscroll.stringify({
                ok: 0,
                error: 'An Error!'
            }), false, '', 'table').then((data) => {
                data.should.be.eql({ok: 0, error: 'An Error!'});
                done();
            });
        })
    })

    describe('Set Edit Data to Form Function', () => {
        it('Should Set the Data Successfully', () => {
            infiscroll.setEditData({ok: 0, error: 'Kevin is Awesome.'}).should.be.equal('edit');
        })

        it('Should Restore the Form Successfully', () => {
            infiscroll.setEditData().should.be.equal('add');
        })
    })

    describe('Handle Ajax Error Function', () => {
        it('Should Handle a 403 Error', () => {
            infiscroll.handleAjaxErrorResponse({status: 403}, false).toLowerCase().should.be.equal('forbidden');
        })

        it('Should Handle a 422 Error', () => {
            infiscroll.handleAjaxErrorResponse({
                status: 422,
                responseJSON: {errors: {error1: ['error1'], error2: ['error2']}}
            }, false).toLowerCase().should.be.equal('unprocessed entity');
        })
    })
})
