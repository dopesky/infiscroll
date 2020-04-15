const validToastTypes = {
    success: `<strong><i class="fa fa-check-circle"></i> Success: </strong>`,
    danger: `<strong><i class="fa fa-times-circle"></i> Error: </strong>`,
    info: `<strong><i class="fa fa-info-circle"></i> Info: </strong>`,
    warning: `<strong><i class="fa fa-exclamation-circle"></i> Warning: </strong>`
};
const revealOnScrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        } else {
            entry.target.classList.remove("is-visible");
        }
    });
});
const lazyImageObserver = new IntersectionObserver(function (entries) {
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
            lazyImageObserver.unobserve(lazyImage);
        }
    });
});
const infiniteScrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && !infiniteScrollObject.fetching) {
            afterInfiniteScrollAjax().then(({hasMoreItems, newItems}) => {
                if (parseInt(newItems)) {
                    $('#show-more').removeClass('d-none');
                }
                if (!hasMoreItems && hasMoreItems !== null) {
                    infiniteScrollObserver.unobserve(entry.target);
                    entry.target.classList.add('d-none');
                }
            });
        }
    });
}, {rootMargin: '0% 0% 100% 0%'});
const infiniteScrollObject = {
    ajax: {},
    hasMoreItems: true,
    newItems: 0,
    size: -1,
    offset: 0,
    fetching: false,
};

let dataTableEditButton = `<i class="fas fa-edit"></i> <span class="d-none d-xl-inline">Edit</span>`;
let dataTableRestoreButton = `<i class="fas fa-check-circle"></i> <span class="d-none d-xl-inline">Restore</span>`;
let dataTableDeleteButton = `<i class="fas fa-times-circle"></i> <span class="d-none d-xl-inline">Delete</span>`;
let dataTableButtonLoadingHtml = `<span class="fa fa-spin fa-spinner"></span> <span class="d-none d-xl-inline"> Working</span>`;

let buttonHtmlAdd = `<button type="submit" class="btn btn-success btn-sm">Add</button>`;
let buttonHtmlEdit = `<button type="submit" class="btn btn-info mr-3 btn-sm">Update</button>`;
let buttonHtmlCancel = `<button type="button" onclick="setEditData()" class="btn btn-danger btn-sm">Cancel</button>`;
let buttonLoadingHtml = `Working . . .`;

let buttonLoadMoreHtml = `<button class="btn btn-primary px-2 py-1 text-center"><i class="fas fa-hand-point-up mr-1"></i> Load New . . .</button>`;
let buttonLoadMoreLoadingHtml = `<i class="spinner-border spinner-border-sm"></i> Fetching . . .`;
let pageState = 'add';


function setToast(options) {
    if (Array.isArray(options)) {
        let response = !!options.length;
        for (let option of options) {
            response = response && setToast(option);
        }
        return response;
    }
    const element = $("#site-info");
    if (element.length < 1) {
        $('body').append(`<div id="site-info"></div>`);
        return setToast(options);
    }
    let {message = 'No Message Passed!', type = 'danger', delay = 5000, classes = 'mb-0'} = options;
    type = type.toLowerCase().trim();
    if (!validToastTypes.hasOwnProperty(type)) return false;
    const html = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${delay}"
    data-toggle="toast"><div class='toast-body alert alert-${type} ${classes}'>${validToastTypes[type]} ${message}</div></div>`;
    return element.append(html).find('.toast:not(.hide,.show)').toast('show');
}

function toggleButton(options) {
    if (Array.isArray(options)) {
        let response = !!options.length;
        for (let option of options) {
            response = response && toggleButton(option);
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

function setFormErrors(errors = null) {
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
}

function capitalize(word, locale = navigator.language) {
    if (!word || !word.trim()) return '';
    return word.trim().split(' ').map(([firstLetter, ...otherLetters]) => {
        return [firstLetter.toLocaleUpperCase(locale), otherLetters.join('').toLocaleLowerCase(locale)].join('');
    }).join(' ');
}

function stringify(data) {
    return JSON.stringify(data, (key, value) => quotesEscape(value));
}

function parse(data) {
    if (typeof data !== 'string') data = stringify(data);
    return JSON.parse(data, (key, value) => quotesEscape(value, true));
}

function getTimezoneEquivalentDate(date, serverTimeZone = 180) {
    date = moment(date);
    return date.isValid() ? date.subtract(serverTimeZone, 'minutes').add(moment().utcOffset(), 'minutes') : false;
}

function initScrollAnimation(selector = '.show-on-scroll') {
    const targets = document.querySelectorAll(selector);
    targets.forEach(function (target) {
        revealOnScrollObserver.observe(target);
    });
    return !!targets.length;
}

function initLazyLoading(selector = '.lazy-load') {
    const targets = document.querySelectorAll(selector);
    targets.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
    return !!targets.length;
}

function initInfiniteScroll(url, successFunction = (data) => data, selector = '#infinite-scroll') {
    const targets = document.querySelectorAll(selector);
    infiniteScrollObject.ajax = {
        ...makeAjaxRequest({url, object: true}),
        successFunction
    };
    if ($("#show-more").length < 1) {
        $('body').prepend(`<div id="show-more" class="d-none">${buttonLoadMoreHtml}</div>`);
        $('#show-more').children().on('click', function (event) {
            afterInfiniteScrollAjax(event.target).then(() => {
                $('body, html').animate({scrollTop: 0}, () => {
                    $('#show-more').addClass('d-none');
                });
            });
        });
    }

    targets.forEach(function (infiniteScrollElement) {
        infiniteScrollObserver.observe(infiniteScrollElement);
    });
    return !!url && !!targets.length;
}

function makeAjaxRequest({url, data = {}, method = 'POST', object = false, hasImages = false}) {
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

function createDataTable({table = '#data-table', ajax, columns = [], columnDefs = [], etc = {}, isCrud = true, isServerSide = false, deletableRecords = true, editableRecords = true, deleteMarker = 'suspended'}) {
    if (!window.jQuery) {
        setToast({message: 'JQuery is Required for DataTables to Initialize!', type: 'danger'});
        return false;
    }
    if (!window.jQuery.fn.dataTable) {
        setToast({message: 'DataTables has NOT been Installed!', type: 'danger'});
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
                        const restoreButton = `<button onclick="deleteRestore(this, ${data}, 0, '${ajax.url}', '${table}')" 
                                class='btn btn-sm btn-success' title='Restore'>${dataTableRestoreButton}</button>`;
                        const deleteButton = `<button onclick="deleteRestore(this, ${data}, 1, '${ajax.url}', '${table}')" 
                                class='btn btn-sm btn-danger' title='Delete'>${dataTableDeleteButton}</button>`;
                        const editButton = editableRecords ? `<button onclick='setEditData(${stringify(full)})' 
                                class='btn btn-sm btn-info' title='Edit'>${dataTableEditButton}</button>` : '';
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
}

async function addAjax({form = 'form', url = '', dataTable = null, hasImages = false}) {
    form = $(form);
    const button = form.find('button[type=submit]');
    let data = new FormData(form[0]);
    toggleButton({button, html: buttonLoadingHtml});
    let returnValue;
    try {
        let response = await makeAjaxRequest({url, data, hasImages});
        if (response.ok) {
            setToast({
                message: `Record Successfully Registered.`,
                type: 'success'
            });
            setFormErrors();
            if (dataTable) dataTable.ajax.reload();
            form[0].reset();
        } else {
            setFormErrors([response.error]);
        }
        returnValue = response;
    } catch (response) {
        handleAjaxErrorResponse(response);
        returnValue = {ok: false, error: response};
    }
    toggleButton({button, html: $(buttonHtmlAdd).html()});
    return returnValue;
}

async function editAjax({form = 'form', url = '', dataTable = null, hasImages = false, method = 'PUT'}) {
    form = $(form);
    const button = form.find('button[type=submit]');
    let data = new FormData(form[0]);
    toggleButton({button, html: buttonLoadingHtml});
    let returnValue;
    try {
        let response = await makeAjaxRequest({url, data, hasImages, method});
        if (response.ok) {
            setToast({
                message: `Record Successfully Updated.`,
                type: 'success'
            });
            setFormErrors();
            if (dataTable) dataTable.ajax.reload();
            setEditData();
        } else {
            setFormErrors([response.error]);
            toggleButton({button, html: $(buttonHtmlEdit).html()});
        }
        returnValue = response;
    } catch (response) {
        handleAjaxErrorResponse(response);
        returnValue = {ok: false, error: response};
        toggleButton({button, html: $(buttonHtmlEdit).html()});
    }
    return returnValue;
}

async function deleteRestore(button, id, suspend, url, table) {
    const buttonHtml = suspend ? dataTableDeleteButton : dataTableRestoreButton;
    toggleButton({button, html: dataTableButtonLoadingHtml});
    let response = null;
    try {
        response = await makeAjaxRequest({url, data: {id}, method: 'DELETE'});
        if (response.ok) {
            setToast({
                message: `Record Successfully ${suspend ? 'Suspended' : 'Restored'}.`,
                type: 'success'
            });
            new $.fn.dataTable.Api(table).ajax.reload();
        } else {
            setToast({
                message: `${response.error}`,
                type: 'danger'
            });
            toggleButton({button, html: buttonHtml});
        }
    } catch (errorObject) {
        response = errorObject;
        handleAjaxErrorResponse(errorObject);
        toggleButton({button, html: buttonHtml});
    }
    return response;
}

// TODO: Find a way to optimize this function
function setEditData(data = null, form = 'form') {
    setFormErrors();
    form = $(form);
    pageState = data ? 'edit' : 'add';
    let pageTitles = document.querySelectorAll('.page-title');
    let buttonDiv = $('#button-div');
    if (data) {
        data = parse(data);
        pageTitles.forEach(function (value) {
            value.innerHTML = value.dataset.edit;
        });
        buttonDiv.html(buttonHtmlEdit + buttonHtmlCancel);
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
        buttonDiv.html(buttonHtmlAdd);
        form[0].reset();
    }

    return pageState;
}

function handleAjaxErrorResponse(response, logErrors = true) {
    let description = '';
    if (response.status === 403) {
        setFormErrors(['You do not have Enough Rights to Perform that Action.']);
        description = 'Forbidden';
    } else if (response.status === 422) {
        let errorKeys = Object.keys(response.responseJSON.errors);
        if (Array.isArray(errorKeys)) {
            let errors = errorKeys.map((key) => {
                return response.responseJSON.errors[key].map(item => `<p>${item}</p>`).join('');
            });
            setFormErrors(errors);
        }
        description = 'Unprocessed Entity';
    }
    if (logErrors) console.log(response);
    return description;
}

function quotesEscape(string, reverse = false) {
    const isTruthyString = string && typeof string === "string";
    if (reverse) return isTruthyString ? string.replace(/~/g, "'").replace(/`/g, '"') : string;
    return isTruthyString ? string.replace(/'/g, '~').replace(/"/g, '`') : string;
}

function afterInfiniteScrollAjax(button = null) {
    const {ajax, newItems, hasMoreItems, offset, size} = infiniteScrollObject;
    if (!ajax.url || !ajax.hasOwnProperty('data')) return Promise.resolve(false);
    ajax.data = {...ajax.data, newItems, hasMoreItems, offset, size, ...(button && {loadNewItems: true})};
    infiniteScrollObject.fetching = true;
    if (button) toggleButton({button, html: buttonLoadMoreLoadingHtml});
    return $.ajax(ajax).then(ajax.successFunction).then(({hasMoreItems = null, newItems, offset, size}) => {
        if (button) toggleButton({button, html: $(buttonLoadMoreHtml).html()});
        infiniteScrollObject.fetching = false;
        if (!button) infiniteScrollObject.hasMoreItems = !!hasMoreItems;
        infiniteScrollObject.newItems = parseInt(newItems);
        infiniteScrollObject.offset = parseInt(offset);
        infiniteScrollObject.size = parseInt(size);
        return {hasMoreItems: infiniteScrollObject.hasMoreItems, newItems, offset, size};
    });
}

let infiscroll = {
    validToastTypes,
    revealOnScrollObserver,
    lazyImageObserver,
    infiniteScrollObserver,
    infiniteScrollObject,
    dataTableEditButton,
    dataTableRestoreButton,
    dataTableDeleteButton,
    dataTableButtonLoadingHtml,
    buttonHtmlAdd,
    buttonHtmlEdit,
    buttonHtmlCancel,
    buttonLoadingHtml,
    buttonLoadMoreHtml,
    buttonLoadMoreLoadingHtml,
    pageState,
    setToast,
    toggleButton,
    setFormErrors,
    capitalize,
    stringify,
    parse,
    getTimezoneEquivalentDate,
    initLazyLoading,
    initInfiniteScroll,
    initScrollAnimation,
    makeAjaxRequest,
    createDataTable,
    addAjax,
    editAjax,
    deleteRestore,
    setEditData,
    handleAjaxErrorResponse
}

module.exports = {infiscroll};

for (let item in infiscroll) {
    global[item] = infiscroll[item];
}
