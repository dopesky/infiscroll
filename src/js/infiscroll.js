require('@babel/polyfill');
// TODO: Support Inline Error Messages in Forms
// TODO: Add Support for Laravel Livewire
class Infiscroll {
    constructor(options = {}) {
        this.validToastTypes = options.validToastTypes || {
            success: `<strong><i class="fas fa-check-circle"></i> Success: </strong>`,
            danger: `<strong><i class="fas fa-times-circle"></i> Error: </strong>`,
            info: `<strong><i class="fas fa-info-circle"></i> Info: </strong>`,
            warning: `<strong><i class="fas fa-exclamation-circle"></i> Warning: </strong>`
        };
        this.infiniteScrollObject = options.infiniteScrollObject || {
            ajax: {},
            hasMoreItems: true,
            newItems: 0,
            size: -1,
            offset: 0,
            fetching: false,
        };
        this.revealOnScrollObserver = options.revealOnScrollObserver || new IntersectionObserver(function (entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const revealElement = entry.target;
                    const loopInfinitely = revealElement.dataset.infinite ? revealElement.dataset.infinite.toLowerCase().trim() : 'true';
                    revealElement.classList.add("is-visible");
                    if (!loopInfinitely || loopInfinitely === 'false') {
                        observer.unobserve(revealElement);
                    }
                } else {
                    entry.target.classList.remove("is-visible");
                }
            });
        });
        this.lazyImageObserver = options.lazyImageObserver || new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                // TODO: Support video and picture tags
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    const tagName = lazyImage.tagName.toLowerCase().trim();
                    if (tagName === 'img') {
                        lazyImage.src = lazyImage.dataset.src;
                        if (lazyImage.dataset.hasOwnProperty('srcset')) lazyImage.srcset = lazyImage.dataset.srcset;
                    } else {
                        lazyImage.style.background = `url(${lazyImage.dataset.src})`;
                    }
                    observer.unobserve(lazyImage);
                }
            });
        });
        this.infiniteScrollObserver = options.infiniteScrollObserver || new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.infiniteScrollObject.fetching) {
                    this.afterInfiniteScrollAjax().then(({hasMoreItems, newItems}) => {
                        if (parseInt(newItems)) {
                            document.getElementById('show-more').classList.remove('d-none');
                        }
                        if (!hasMoreItems && hasMoreItems !== null) {
                            this.infiniteScrollObserver.unobserve(entry.target);
                            entry.target.classList.add('d-none');
                        }
                    });
                }
            });
        }, {rootMargin: '0% 0% 100% 0%'});
        this.dataTableEditButton = options.dataTableEditButton || `<i class="fas fa-edit"></i> <span class="d-none d-xl-inline">Edit</span>`;
        this.dataTableRestoreButton = options.dataTableRestoreButton || `<i class="fas fa-check-circle"></i> <span class="d-none d-xl-inline">Restore</span>`;
        this.dataTableDeleteButton = options.dataTableDeleteButton || `<i class="fas fa-times-circle"></i> <span class="d-none d-xl-inline">Delete</span>`;
        this.dataTableButtonLoadingHtml = options.dataTableButtonLoadingHtml || `<span class="fas fa-spin fa-spinner"></span> <span class="d-none d-xl-inline"> Working</span>`;
        this.dataTableNonEditableHtml = options.dataTableNonEditableHtml || ``;
        this.dataTableNonDeletableHtml = options.dataTableNonDeletableHtml || ``;
        this.buttonHtmlAdd = options.buttonHtmlAdd || `<button type="submit" class="btn btn-success btn-sm">Add</button>`;
        this.buttonHtmlEdit = options.buttonHtmlEdit || `<button type="submit" class="btn btn-info mr-3 btn-sm">Update</button>`;
        this.buttonHtmlCancel = options.buttonHtmlCancel;
        this.buttonLoadingHtml = options.buttonLoadingHtml || `Working . . .`;
        this.buttonLoadMoreHtml = options.buttonLoadMoreHtml || `<button class="btn btn-primary px-2 py-1 text-center"><i class="fas fa-hand-point-up mr-1"></i> Load New . . .</button>`;
        this.buttonLoadMoreLoadingHtml = options.buttonLoadMoreLoadingHtml || `<i class="spinner-border spinner-border-sm"></i> Fetching . . .`;
        this.pageState = options.pageState || 'add';
        this.setEditDataPreProcess = options.setEditDataPreProcess || (() => true);
        this.setEditDataPostProcess = options.setEditDataPostProcess || (() => true);
    }

    setToast(options) {
        if (!window.jQuery) {
            console.error('JQuery is Required for Toasts to Initialize!');
            return false;
        }
        if (!window.jQuery.toast && !window.jQuery.fn.toast) {
            console.error('Bootstrap >=4.2 is Required for Toasts to Initialize!');
            return false;
        }
        if (Array.isArray(options)) {
            let response = !!options.length;
            for (let option of options) {
                response = response && this.setToast(option);
            }
            return response;
        }
        const element = $("#site-info");
        if (element.length < 1) {
            $('body').append(`<div id="site-info"></div>`);
            return this.setToast(options);
        }
        let {message = 'No Message Passed!', type = 'danger', delay = 5000, classes = ''} = options;
        type = type.toLowerCase().trim();
        if (!this.validToastTypes.hasOwnProperty(type)) return false;
        const html = `<div class="toast ${classes}" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${delay}"
        data-toggle="toast"><div class='toast-body alert alert-${type} mb-0'>${this.validToastTypes[type]} ${message}</div></div>`;
        return element.append(html).find('.toast:not(.hide,.show)').toast('show');
    }

    toggleButton(options) {
        if (!window.jQuery) {
            console.error('JQuery is Required for Button Toggle to Work!');
            return false;
        }
        if (Array.isArray(options)) {
            let response = !!options.length;
            for (let option of options) {
                response = response && this.toggleButton(option);
            }
            return response;
        }
        let {button, html = '<p>No Html Set!</p>', removeClassesOnDisabled = '', addClassesOnDisabled = 'disabled'} = options;
        if (!button) return false;
        const disabled = !$(button).attr('disabled');
        const removeClass = disabled ? removeClassesOnDisabled : addClassesOnDisabled;
        const addClass = disabled ? addClassesOnDisabled : removeClassesOnDisabled;
        $(button)
            .attr({'disabled': disabled})
            .removeClass(removeClass)
            .addClass(addClass)
            .html(html);
        return true;
    }

    setFormErrors(errors = null) {
        const container = document.getElementById('form-errors-container');
        const errorsDiv = document.getElementById('form-errors');
        if (!container || !errorsDiv) return false;
        errors = Array.isArray(errors) ? errors.map(error => `<p>${error}</p>`).join('') : errors;
        if (errors) {
            container.classList.remove('d-none');
            errorsDiv.innerHTML = errors;
        } else {
            container.classList.add('d-none');
        }
        return !!errors;
    }

    capitalize(word, locale = navigator.language) {
        if (!word || !word.trim()) return '';
        return word.trim().split(' ').map(([firstLetter, ...otherLetters]) => {
            return [firstLetter.toLocaleUpperCase(locale), otherLetters.join('').toLocaleLowerCase(locale)].join('');
        }).join(' ');
    }

    stringify(data) {
        return JSON.stringify(data, (key, value) => this.quotesEscape(value));
    }

    parse(data) {
        if (typeof data !== 'string') data = this.stringify(data);
        return JSON.parse(data, (key, value) => this.quotesEscape(value, true));
    }

    getClientTimeFromServerTime(date, serverTimeZone = 0) {
        if (!window.moment) {
            console.error('MomentJS is Required to Convert Client Time to Server Time');
            return false;
        }
        date = window.moment(date);
        return date.isValid() ? date.subtract(serverTimeZone, 'minutes').add(window.moment().utcOffset(), 'minutes') : false;
    }

    initScrollAnimation(selector = '.show-on-scroll') {
        const targets = document.querySelectorAll(selector);
        targets.forEach((target) => {
            this.revealOnScrollObserver.observe(target);
        });
        return !!targets.length;
    }

    initLazyLoading(selector = '.lazy-load') {
        const targets = document.querySelectorAll(selector);
        targets.forEach((lazyImage) => {
            this.lazyImageObserver.observe(lazyImage);
        });
        return !!targets.length;
    }

    initInfiniteScroll(url, successFunction = (data) => data, selector = '#infinite-scroll') {
        if (!window.jQuery) {
            console.error('JQuery is Required for Infinite Scroll to Initialize!');
            return false;
        }
        const targets = document.querySelectorAll(selector);
        this.infiniteScrollObject.ajax = {
            ...this.makeAjaxRequest({url, object: true}),
            successFunction
        };
        if ($("#show-more").length < 1) {
            $('body').prepend(`<div id="show-more" class="d-none">${this.buttonLoadMoreHtml}</div>`);
            $('#show-more').children().on('click', (event) => {
                this.afterInfiniteScrollAjax(event.target).then(() => {
                    $('body, html').animate({scrollTop: 0}, () => {
                        document.getElementById('show-more').classList.add('d-none');
                    });
                });
            });
        }

        targets.forEach((infiniteScrollElement) => {
            this.infiniteScrollObserver.observe(infiniteScrollElement);
        });
        return !!url && !!targets.length;
    }

    makeAjaxRequest({url, data = {}, method = 'POST', object = false, hasImages = false}) {
        if (!window.jQuery) {
            console.error('JQuery is Required for Ajax Requests');
            return false;
        }
        const token = $('meta[name="csrf-token"]').attr('content');
        let ajaxObject = {
            url,
            data,
            method,
            dataType: 'json',
            headers: {
                'X-CSRF-TOKEN': token || ''
            },
            ...(hasImages && {processData: false, contentType: false})
        };
        return object ? ajaxObject : $.ajax(ajaxObject);
    }

    createDataTable({table = '#data-table', form = 'form', ajax, columns = [], columnDefs = [], etc = {}, isCrud = true, isServerSide = false, deletableRecords = true, editableRecords = true, deleteMarker = 'suspended'}) {
        if (!window.jQuery) {
            console.error('JQuery is Required for DataTables to Initialize!');
            return false;
        }
        if (!window.jQuery.fn.dataTable) {
            this.setToast({message: 'DataTables has NOT been Installed!', type: 'danger'});
            return false;
        }
        ajax.dataSrc = ajax.dataSrc || ((data) => data);
        $.fn.dataTable.Buttons.defaults.buttons = [];
        $.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons d-flex justify-content-md-end ml-2 flex-wrap';
        $.fn.dataTable.ext.classes.sFilter = 'dataTables_filter d-flex align-items-center';
        $.fn.dataTable.ext.classes.sPageButton = 'page-item dataTables-pagination-list-item';
        $.fn.dataTable.ext.classes.sProcessing = "dataTables_processing card";
        let {language = {}} = etc, {paginate = {}} = language;
        delete etc['language'];
        delete language['paginate'];
        let options = {
            dom: "<'row align-items-center'<'col-12 col-md-6'f><'col-12 col-md-6'B>><'row'<'col-12'rt>><'row'<'col-12 d-flex justify-content-end'p>>",
            language: {
                search: `<div class="input-group">_INPUT_<div class="input-group-append"><div class="input-group-text"><i class="fas fa-search"></i></div></div></div>`,
                searchPlaceholder: 'Search . . .',
                paginate: {
                    first: `<span class="fas fa-angle-double-left"></span>`,
                    last: `<span class="fas fa-angle-double-right"></span>`,
                    next: `<span class="fas fa-angle-right"></span>`,
                    previous: `<span class="fas fa-angle-left"></span>`,
                    ...paginate
                },
                ...(isServerSide && {processing: `<i class='fas fa-spin fa-spinner fa-4x text-muted'></i>`}),
                ...language
            },
            responsive: true,
            autoWidth: true,
            ...(isCrud && {ajax}),
            ...(isCrud && {columns}),
            columnDefs: [
                ...columnDefs,
                {
                    ...(isCrud && (deletableRecords || editableRecords) && {
                        targets: columns.length - 1,
                        orderable: false,
                        searchable: false,
                        class: 'text-center',
                        render: (data, type, full) => {
                            if (!full.hasOwnProperty(deleteMarker)) return data;
                            const restoreButton = `<button data-id="${data}" data-suspend="0" class='btn btn-sm btn-success delete-restore-button' 
                               title='Restore'>${this.dataTableRestoreButton}</button>`;
                            const deleteButton = `<button data-id="${data}" data-suspend="1" class='btn btn-sm btn-danger delete-restore-button' 
                                title='Delete'>${this.dataTableDeleteButton}</button>`;
                            const editButton = `<button class='btn btn-sm btn-info update-button' title='Edit'>${this.dataTableEditButton}</button>`;
                            return `<div class='d-flex align-items-center
                                justify-content-${deletableRecords && editableRecords ? 'around' : 'center'}'>
                                ${editableRecords && (!full.hasOwnProperty('editable') || full.editable) ? editButton : this.dataTableNonEditableHtml}
                                ${deletableRecords && (!full.hasOwnProperty('deletable') || full.deletable) ? (full[deleteMarker] ? restoreButton : deleteButton) : this.dataTableNonDeletableHtml}</div>`;
                        },
                    })
                }
            ],
            ...(isServerSide && {
                serverSide: true,
                processing: true,
            }),
            ...etc,
        };
        let dataTable = $(table).DataTable(options);
        $(table).find('tbody').on('click', '.delete-restore-button', (event) => {
            const {url, deleteURL} = ajax;
            let data = {
                button: event.currentTarget,
                id: $(event.currentTarget).data('id'),
                url: deleteURL || url,
                suspend: $(event.currentTarget).data('suspend'),
                table
            };
            const ignored = this.deleteRestore(data);
        });
        $(table).find('tbody').on('click', '.update-button', (event) => {
            const options = {
                data: dataTable.row($(event.currentTarget).closest('tr')).data(),
                form
            };
            this.setEditData(options);
        });
        return dataTable;
    }

    async addEditAjax({form = 'form', url = '', dataTable = '', formData = {}, successMessage = null, resetForm = true}) {
        if (!window.jQuery) {
            console.error('JQuery is Required for Ajax Enabled Functions to Work!');
            return false;
        }
        successMessage = successMessage || (infiscrollObject.pageState === 'add' ? 'Record Successfully Registered.' : 'Record Successfully Updated.');
        form = $(form);
        const button = form.find('button[type=submit]');
        let data = new FormData(form[0]);
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        this.toggleButton({button, html: this.buttonLoadingHtml});
        let returnValue;
        try {
            let response = await this.makeAjaxRequest({url, data, hasImages: true});
            let {ok = false, error = "An Unexpected Error Occurred!"} = response;
            if (ok) {
                this.setToast({
                    message: successMessage,
                    type: 'success'
                });
                this.setFormErrors();
                if (dataTable) dataTable.ajax.reload();
                if (this.pageState === 'add' && resetForm) form[0].reset();
                if (this.pageState === 'edit' && resetForm) this.setEditData({form});
                if (this.pageState === 'edit' && !resetForm) this.toggleButton({button, html: $(this.buttonHtmlEdit).html()});
            } else {
                this.setFormErrors([error]);
                if (this.pageState === 'edit') this.toggleButton({button, html: $(this.buttonHtmlEdit).html()});
            }
            returnValue = response;
        } catch (response) {
            this.handleAjaxErrorResponse(response);
            returnValue = {ok: false, error: response};
            if (this.pageState === 'edit') this.toggleButton({button, html: $(this.buttonHtmlEdit).html()});
        }
        if (this.pageState === 'add') this.toggleButton({button, html: $(this.buttonHtmlAdd).html()});
        return returnValue;
    }

    async deleteRestore({button = 'button', id = 0, suspend = 1, url = '', table = 'table', buttonAllHtml = '', buttonLoadingHtml = '', method = 'DELETE', formData = {}, successMessage = `Record Successfully ${suspend ? 'Suspended' : 'Restored'}.`} = {}) {
        if (!window.jQuery) {
            console.error('JQuery is Required for deleteRestore function to Work!');
            return false;
        }
        const buttonHtml = buttonAllHtml || (suspend ? this.dataTableDeleteButton : this.dataTableRestoreButton);
        this.toggleButton({button, html: buttonLoadingHtml || this.dataTableButtonLoadingHtml});
        let response = null;
        try {
            response = await this.makeAjaxRequest({url, data: {...formData, ...(id && {id})}, method});
            let {ok = false, error = "An Unexpected Error Occurred!"} = response;
            if (ok) {
                this.setToast({
                    message: successMessage,
                    type: 'success'
                });
                if (table) new $.fn.dataTable.Api(table).ajax.reload();
            } else {
                this.setToast({
                    message: `${error}`,
                    type: 'danger'
                });
                this.toggleButton({button, html: buttonHtml});
            }
        } catch (errorObject) {
            response = errorObject;
            this.handleAjaxErrorResponse(errorObject, true);
            this.toggleButton({button, html: buttonHtml});
        }
        return response;
    }

    setEditData({data = null, form = 'form', scrollToTop = true} = {}) {
        if (!window.jQuery) {
            console.error('JQuery is Required for setEditData function to Work!');
            return false;
        }
        this.setFormErrors();
        form = $(form);
        this.pageState = data ? 'edit' : 'add';
        let pageTitles = document.querySelectorAll('.page-title');
        let buttonDiv = $('#button-div');
        this.setEditDataPreProcess(data, this.pageState);
        if (data) {
            pageTitles.forEach(function (value) {
                value.innerHTML = value.dataset.edit;
            });
            buttonDiv.html(this.buttonHtmlEdit);
            buttonDiv.append(this.buttonHtmlCancel || (() => {
                let button = document.createElement('button');
                button.className += "btn btn-danger btn-sm";
                button.type = "button";
                button.addEventListener('click', () => this.setEditData({form}));
                button.innerText = 'Cancel';
                return button;
            }));
            for (let item in data) {
                if (!data.hasOwnProperty(item)) continue;
                form.find(`input[name=${item}]:not([type=radio]):not([type=checkbox]), select[name=${item}], textarea[name=${item}]`)
                    .not('.ignore').val(data[item]);
                let checkboxes = form.find(`input[name=${item}][type=checkbox], input[name=${item}][type=radio]`).not('.ignore');
                if (data[item] === true || data[item] === false) {
                    if (checkboxes.length > 0) checkboxes[0].checked = data[item];
                } else {
                    for (let i = 0; i < checkboxes.length; i++) checkboxes[i].checked = checkboxes[i].value === data[item];
                }
            }
            if (scrollToTop) $('body, html').animate({scrollTop: 0});
        } else {
            pageTitles.forEach(function (value) {
                value.innerHTML = value.dataset.add;
            });
            buttonDiv.html(this.buttonHtmlAdd);
            form[0].reset();
        }
        this.setEditDataPostProcess(data, this.pageState);
        return this.pageState;
    }

    handleAjaxErrorResponse(response, toast = false, logErrors = true) {
        let description = '';
        if (response.status === 403) {
            const message = ['You do not have Enough Rights to Perform that Action.'];
            if (toast) this.setToast({message, type: 'danger'});
            else this.setFormErrors(message);
            description = 'Forbidden';
        } else if (response.status === 422) {
            let errorKeys = Object.keys(response.responseJSON.errors);
            if (Array.isArray(errorKeys)) {
                let message = errorKeys.map((key) => {
                    return response.responseJSON.errors[key].map(item => `<p>${item}</p>`).join('');
                });
                if (toast) this.setToast({message, type: 'danger'});
                else this.setFormErrors(message);
            }
            description = 'Unprocessed Entity';
        }
        if (logErrors) console.log(response);
        return description;
    }

    quotesEscape(data, reverse = false) {
        const isTruthyString = data && typeof data === "string";
        if (reverse) return isTruthyString ? data.replace(/~/g, "'").replace(/`/g, '"') : data;
        return isTruthyString ? data.replace(/'/g, '~').replace(/"/g, '`') : data;
    }

    afterInfiniteScrollAjax(button = null) {
        const {ajax, newItems, hasMoreItems, offset, size} = this.infiniteScrollObject;
        if (!ajax.url || !ajax.hasOwnProperty('data')) return Promise.resolve(false);
        ajax.data = {...ajax.data, newItems, hasMoreItems, offset, size, ...(button && {loadNewItems: true})};
        this.infiniteScrollObject.fetching = true;
        if (button) this.toggleButton({button, html: this.buttonLoadMoreLoadingHtml});
        return $.ajax(ajax).then(ajax.successFunction).then(({hasMoreItems = null, newItems, offset, size}) => {
            if (button) this.toggleButton({button, html: $(this.buttonLoadMoreHtml).html()});
            this.infiniteScrollObject.fetching = false;
            if (!button) this.infiniteScrollObject.hasMoreItems = !!hasMoreItems;
            this.infiniteScrollObject.newItems = parseInt(newItems);
            this.infiniteScrollObject.offset = parseInt(offset);
            this.infiniteScrollObject.size = parseInt(size);
            return {hasMoreItems: this.infiniteScrollObject.hasMoreItems, newItems, offset, size};
        });
    }
}

/**
 * Functions that need jquery
 * setToast
 * toggleButton
 * Infinite Scroll
 * makeAjaxRequest
 * createDataTable
 * addAjax
 * editAjax
 * deleteRestore
 * setEditData
 * handleAjaxErrorResponse if toast is truthy
 *
 * Functions that need bootstrap
 * setToast
 * deleteRestore
 * handleAjaxErrorResponse if toast is truthy
 *
 * Functions that depend on data tables
 * createDataTable
 * addAjax if dataTable is truthy
 * editAjax if dataTable is truthy
 * deleteRestore if table is truthy
 */
module.exports = Infiscroll;
global['Infiscroll'] = Infiscroll;
