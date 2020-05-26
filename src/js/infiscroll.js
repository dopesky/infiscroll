let infiscroll = {
    validToastTypes: {
        success: `<strong><i class="fa fa-check-circle"></i> Success: </strong>`,
        danger: `<strong><i class="fa fa-times-circle"></i> Error: </strong>`,
        info: `<strong><i class="fa fa-info-circle"></i> Info: </strong>`,
        warning: `<strong><i class="fa fa-exclamation-circle"></i> Warning: </strong>`
    },
    infiniteScrollObject: {
        ajax: {},
        hasMoreItems: true,
        newItems: 0,
        size: -1,
        offset: 0,
        fetching: false,
    },
    revealOnScrollObserver: new IntersectionObserver(function (entries, observer) {
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
    }),
    lazyImageObserver: new IntersectionObserver(function (entries, observer) {
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
    }),
    infiniteScrollObserver: new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !infiscroll.infiniteScrollObject.fetching) {
                infiscroll.afterInfiniteScrollAjax().then(({hasMoreItems, newItems}) => {
                    if (parseInt(newItems)) {
                        $('#show-more').removeClass('d-none');
                    }
                    if (!hasMoreItems && hasMoreItems !== null) {
                        infiscroll.infiniteScrollObserver.unobserve(entry.target);
                        entry.target.classList.add('d-none');
                    }
                });
            }
        });
    }, {rootMargin: '0% 0% 100% 0%'}),
    dataTableEditButton: `<i class="fas fa-edit"></i> <span class="d-none d-xl-inline">Edit</span>`,
    dataTableRestoreButton: `<i class="fas fa-check-circle"></i> <span class="d-none d-xl-inline">Restore</span>`,
    dataTableDeleteButton: `<i class="fas fa-times-circle"></i> <span class="d-none d-xl-inline">Delete</span>`,
    dataTableButtonLoadingHtml: `<span class="fa fa-spin fa-spinner"></span> <span class="d-none d-xl-inline"> Working</span>`,
    buttonHtmlAdd: `<button type="submit" class="btn btn-success btn-sm">Add</button>`,
    buttonHtmlEdit: `<button type="submit" class="btn btn-info mr-3 btn-sm">Update</button>`,
    buttonHtmlCancel: `<button type="button" onclick="setEditData()" class="btn btn-danger btn-sm">Cancel</button>`,
    buttonLoadingHtml: `Working . . .`,
    buttonLoadMoreHtml: `<button class="btn btn-primary px-2 py-1 text-center"><i class="fas fa-hand-point-up mr-1"></i> Load New . . .</button>`,
    buttonLoadMoreLoadingHtml: `<i class="spinner-border spinner-border-sm"></i> Fetching . . .`,
    pageState: 'add',

    setToast: function (options) {
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
        let {message = 'No Message Passed!', type = 'danger', delay = 5000, classes = 'mb-3'} = options;
        type = type.toLowerCase().trim();
        if (!this.validToastTypes.hasOwnProperty(type)) return false;
        const html = `<div class="toast ${classes}" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${delay}"
        data-toggle="toast"><div class='toast-body alert alert-${type} mb-0'>${this.validToastTypes[type]} ${message}</div></div>`;
        return element.append(html).find('.toast:not(.hide,.show)').toast('show');
    },

    toggleButton: function (options) {
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
    },

    setFormErrors: function (errors = null) {
        const container = $('#form-errors-container');
        const errorsDiv = $('#form-errors');
        errors = Array.isArray(errors) ? errors.map(error => `<p>${error}</p>`).join('') : errors;
        if (errors) {
            container.removeClass('d-none');
            errorsDiv.html(errors);
        } else {
            container.addClass('d-none');
        }
        return !!errors;
    },

    capitalize: function (word, locale = navigator.language) {
        if (!word || !word.trim()) return '';
        return word.trim().split(' ').map(([firstLetter, ...otherLetters]) => {
            return [firstLetter.toLocaleUpperCase(locale), otherLetters.join('').toLocaleLowerCase(locale)].join('');
        }).join(' ');
    },

    stringify: function (data) {
        return JSON.stringify(data, (key, value) => this.quotesEscape(value));
    },

    parse: function (data) {
        if (typeof data !== 'string') data = this.stringify(data);
        return JSON.parse(data, (key, value) => this.quotesEscape(value, true));
    },

    getTimezoneEquivalentDate: function (date, serverTimeZone = 180) {
        date = moment(date);
        return date.isValid() ? date.subtract(serverTimeZone, 'minutes').add(moment().utcOffset(), 'minutes') : false;
    },

    initScrollAnimation: function (selector = '.show-on-scroll') {
        const targets = document.querySelectorAll(selector);
        targets.forEach((target) => {
            this.revealOnScrollObserver.observe(target);
        });
        return !!targets.length;
    },

    initLazyLoading: function (selector = '.lazy-load') {
        const targets = document.querySelectorAll(selector);
        targets.forEach((lazyImage) => {
            this.lazyImageObserver.observe(lazyImage);
        });
        return !!targets.length;
    },

    initInfiniteScroll: function (url, successFunction = (data) => data, selector = '#infinite-scroll') {
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
                        $('#show-more').addClass('d-none');
                    });
                });
            });
        }

        targets.forEach((infiniteScrollElement) => {
            this.infiniteScrollObserver.observe(infiniteScrollElement);
        });
        return !!url && !!targets.length;
    },

    makeAjaxRequest: function ({url, data = {}, method = 'POST', object = false, hasImages = false}) {
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
    },

    createDataTable: function ({table = '#data-table', ajax, columns = [], columnDefs = [], etc = {}, isCrud = true, isServerSide = false, deletableRecords = true, editableRecords = true, deleteMarker = 'suspended'}) {
        if (!window.jQuery) {
            this.setToast({message: 'JQuery is Required for DataTables to Initialize!', type: 'danger'});
            return false;
        }
        if (!window.jQuery.fn.dataTable) {
            this.setToast({message: 'DataTables has NOT been Installed!', type: 'danger'});
            return false;
        }
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
                            const restoreButton = `<button onclick="infiscroll.deleteRestore(this, ${data}, 0, '${ajax.url}', '${table}')" 
                                class='btn btn-sm btn-success' title='Restore'>${this.dataTableRestoreButton}</button>`;
                            const deleteButton = `<button onclick="infiscroll.deleteRestore(this, ${data}, 1, '${ajax.url}', '${table}')" 
                                class='btn btn-sm btn-danger' title='Delete'>${this.dataTableDeleteButton}</button>`;
                            const editButton = editableRecords ? `<button onclick='infiscroll.setEditData(${this.stringify(full)})' 
                                class='btn btn-sm btn-info' title='Edit'>${this.dataTableEditButton}</button>` : '';
                            return `<div class='d-flex align-items-center
                                justify-content-${deletableRecords && editableRecords ? 'around' : 'center'}'>${editButton}
                                ${deletableRecords ? (full[deleteMarker] ? restoreButton : deleteButton) : ''}</div>`;
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
        return $(table).DataTable(options);
    },

    addAjax: async function ({form = 'form', url = '', dataTable = null}) {
        form = $(form);
        const button = form.find('button[type=submit]');
        let data = new FormData(form[0]);
        this.toggleButton({button, html: this.buttonLoadingHtml});
        let returnValue;
        try {
            let response = await this.makeAjaxRequest({url, data, hasImages: true});
            if (response.ok) {
                this.setToast({
                    message: `Record Successfully Registered.`,
                    type: 'success'
                });
                this.setFormErrors();
                if (dataTable) dataTable.ajax.reload();
                form[0].reset();
            } else {
                this.setFormErrors([response.error]);
            }
            returnValue = response;
        } catch (response) {
            this.handleAjaxErrorResponse(response);
            returnValue = {ok: false, error: response};
        }
        this.toggleButton({button, html: $(this.buttonHtmlAdd).html()});
        return returnValue;
    },

    editAjax: async function ({form = 'form', url = '', dataTable = null, formData = {}}) {
        form = $(form);
        const button = form.find('button[type=submit]');
        let data = new FormData(form[0]);
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        })
        this.toggleButton({button, html: this.buttonLoadingHtml});
        let returnValue;
        try {
            let response = await this.makeAjaxRequest({url, data, hasImages: true, method: 'POST'});
            if (response.ok) {
                this.setToast({
                    message: `Record Successfully Updated.`,
                    type: 'success'
                });
                this.setFormErrors();
                if (dataTable) dataTable.ajax.reload();
                this.setEditData();
            } else {
                this.setFormErrors([response.error]);
                this.toggleButton({button, html: $(this.buttonHtmlEdit).html()});
            }
            returnValue = response;
        } catch (response) {
            this.handleAjaxErrorResponse(response);
            returnValue = {ok: false, error: response};
            this.toggleButton({button, html: $(this.buttonHtmlEdit).html()});
        }
        return returnValue;
    },

    deleteRestore: async function (button, id, suspend, url, table) {
        const buttonHtml = suspend ? this.dataTableDeleteButton : this.dataTableRestoreButton;
        this.toggleButton({button, html: this.dataTableButtonLoadingHtml});
        let response = null;
        try {
            response = await this.makeAjaxRequest({url, data: {id}, method: 'DELETE'});
            if (response.ok) {
                this.setToast({
                    message: `Record Successfully ${suspend ? 'Suspended' : 'Restored'}.`,
                    type: 'success'
                });
                new $.fn.dataTable.Api(table).ajax.reload();
            } else {
                this.setToast({
                    message: `${response.error}`,
                    type: 'danger'
                });
                this.toggleButton({button, html: buttonHtml});
            }
        } catch (errorObject) {
            response = errorObject;
            this.handleAjaxErrorResponse(errorObject);
            this.toggleButton({button, html: buttonHtml});
        }
        return response;
    },

    setEditData: function (data = null, form = 'form') {
        this.setFormErrors();
        form = $(form);
        this.pageState = data ? 'edit' : 'add';
        let pageTitles = document.querySelectorAll('.page-title');
        let buttonDiv = $('#button-div');
        data = data ? this.parse(data) : data;
        this.setEditDataProcess(data);
        if (data) {
            pageTitles.forEach(function (value) {
                value.innerHTML = value.dataset.edit;
            });
            buttonDiv.html(this.buttonHtmlEdit + this.buttonHtmlCancel);
            for (let item in data) {
                if (!data.hasOwnProperty(item)) continue;
                form.find(`input[name=${item}], select[name=${item}], textarea[name=${item}]`)
                    .not('.ignore').val(data[item]);
            }
            $('body, html').animate({scrollTop: 0});
        } else {
            pageTitles.forEach(function (value) {
                value.innerHTML = value.dataset.add;
            });
            buttonDiv.html(this.buttonHtmlAdd);
            form[0].reset();
        }

        return this.pageState;
    },

    setEditDataProcess: (data) => data,

    handleAjaxErrorResponse: function (response, logErrors = true) {
        let description = '';
        if (response.status === 403) {
            this.setFormErrors(['You do not have Enough Rights to Perform that Action.']);
            description = 'Forbidden';
        } else if (response.status === 422) {
            let errorKeys = Object.keys(response.responseJSON.errors);
            if (Array.isArray(errorKeys)) {
                let errors = errorKeys.map((key) => {
                    return response.responseJSON.errors[key].map(item => `<p>${item}</p>`).join('');
                });
                this.setFormErrors(errors);
            }
            description = 'Unprocessed Entity';
        }
        if (logErrors) console.log(response);
        return description;
    },

    quotesEscape: function (string, reverse = false) {
        const isTruthyString = string && typeof string === "string";
        if (reverse) return isTruthyString ? string.replace(/~/g, "'").replace(/`/g, '"') : string;
        return isTruthyString ? string.replace(/'/g, '~').replace(/"/g, '`') : string;
    },

    afterInfiniteScrollAjax: function (button = null) {
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
    },
};

module.exports = {infiscroll};
global['infiscroll'] = infiscroll;
