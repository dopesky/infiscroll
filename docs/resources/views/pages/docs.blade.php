@extends('partials.template')
@section('content')
    <style>
        .nav-link, .nav-link:hover {
            color: var(--rose);
        }

        ul .active {
            background: var(--rose) !important;
        }

        ul a {
            font-family: 'Roboto Slab', sans-serif;
        }

        i {
            color: #6c757d !important;
        }
    </style>
    <main class="p-4 container-fluid">
        <div class="row">
            <div class="col-12 col">
                <h5 class="text-center mb-3"><i class="fas fa-book"></i> Official Documentation</h5>
                <div class="border rounded">
                    @php
                        $parser = new Parsedown();
                        $readme = file_get_contents(config('app.env') === 'local' ? '../README.md' : 'https://unpkg.com/@dopesky/infiscroll@latest/README.md');
                        $readme = $parser->text($readme);

                        function openFunction($functionName):string{return "<b>$functionName ( </b>";}

                        function openProperty($propertyName):string{return "<b>$propertyName: </b>";}

                        function closeFunction():string{return "<b>)</b>:";}

                        function returnType($type, $default = '', $use_default_as_is = false):string{return "<em class='text-purple'>$type</em>" . ($default || $use_default_as_is ? " = <i>$default</i>" : '');}

                        function arguments($arg, $type, $default = '', $use_default_as_is = false):string{return "<span class='text-rose'>$arg:</span> " . returnType($type, $default, $use_default_as_is);}
                    @endphp
                    <ul class="nav nav-pills nav-justified bg-light border-bottom rounded font-sm">
                        <li class="nav-item">
                            <a class="nav-link active no-wrap" data-toggle="pill" href="#intro">Overview</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link no-wrap" data-toggle="pill" href="#scroll">Infinite Scroll</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link no-wrap" data-toggle="pill" href="#lazy">Lazy Loading</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link no-wrap" data-toggle="pill" href="#reveal">Scroll Reveal</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link no-wrap" data-toggle="pill" href="#ajax">Ajax Helpers (DataTable)</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link no-wrap" data-toggle="pill" href="#utilities">Utilities</a>
                        </li>
                    </ul>
                    <div class="tab-content p-4 font-sm">
                        <div class="tab-pane active" id="intro">
                            {!! $readme !!}
                        </div>
                        <div class="tab-pane" id="scroll">
                            Infinite Scroll Functionality depends on the following functions and properties:
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('initInfiniteScroll') !!}
                                    {!! arguments('url', 'string') !!},
                                    {!! arguments('successFunction', 'Callback', "(data) -> data") !!},
                                    {!! arguments('selector', 'string', '#infinite-scroll') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                                <div>
                                    Call this Function in order to Initiate Infinite Scrolling on a page.
                                    Pass the URL to fetch data while scrolling, an optional success callback
                                    in order to make use of the fetched data and an optional element selector
                                    that will be used to tell the function to fetch more data. This last parameter
                                    can be a loading div and it will be hidden if the server does not have any more
                                    data to fetch. It overrides the ajax parameter of the <em>infiniteScrollObject</em>.
                                    Returns true if infinite scroll was initialized successfully on at least 1 element
                                    with the supplied selector.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('infiniteScrollObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <div>
                                    This is an IntersectionObserver for infinite scroll. It is registered on all
                                    HTMLElements with the supplied selector on the <em>initInfiniteScroll</em> method
                                    and is responsible for firing a post request to the supplied URL every time the
                                    elements come into view and the server contains more data. It UnObserves itself and
                                    hides the trigger elements when the server returns that no more data exists. If
                                    Overridden, ensure you call the <em>afterInfiniteScroll</em> function below. Do
                                    not call your successFunction from here.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('afterInfiniteScrollAjax') !!}
                                    {!! arguments('button', 'HTMLElement | jQuery | string | null', 'null') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('Promise < object >') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                                <div>
                                    This is an Internal Function that is called to clean up after infinite scroll
                                    has made a post request. It is responsible for calling the successFunction you
                                    provide on initialization. It takes one argument which is a button. If the button
                                    is null, the function makes an ajax call for newer data else it makes an ajax call
                                    for older data.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('infiniteScrollObject') !!}
                                    {!! returnType('Object', "{ ajax: {}, hasMoreItems: true, newItems: 0, size: -1, offset: 0, fetching: false }") !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <div>
                                    This variable contains some properties crucial to the functioning of the infinite
                                    scroll functionality. It should only be overridden to set new default values of its
                                    parameters (all except ajax). These parameters should not be added to or
                                    removed from the object otherwise the functionality will behave unexpectedly.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonLoadMoreHtml') !!}
                                    {!! returnType('string', htmlspecialchars("<button class='btn btn-primary px-2 py-1 text-center'><i class='fas fa-hand-point-up mr-1'></i> Load New . . .</button>")) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <div>
                                    This variable specifies the outer html of the button to be displayed at the top
                                    of the screen if the server has newer data to load. If this button is clicked,
                                    the infinite scroll functionality will initiate an ajax request requesting for
                                    newer data.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonLoadMoreLoadingHtml') !!}
                                    {!! returnType('string', htmlspecialchars('<i class="spinner-border spinner-border-sm"></i> Fetching . . .')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <div>
                                    This variable specifies the inner html of the button described in <em>buttonLoadMoreHtml</em>
                                    variable above for when newer data is being loaded from the server.
                                </div>
                            </div>
                            <h6 class="font-sm"><b>Utility Functions Used</b></h6>
                            <div>
                                <span class="badge badge-light text-muted">makeAjaxRequest</span>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="lazy">
                            Image Lazy Load Functionality depends on the following functions and properties:
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('initLazyLoading') !!}
                                    {!! arguments('selector', 'string', '.lazy-load') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <hr>
                                <div>
                                    Call this Function in order to Initialize Image Lazy Loading on a page.
                                    Pass an optional element selector that will be used to tell the function to load the
                                    image
                                    once the page is scrolled to the image position. It uses the
                                    <em>lazyImageObserver</em>
                                    described below to know whether the image to be loaded is in view of the user
                                    (i.e it is intersecting with the window). Returns true if lazy loading was
                                    initialized
                                    successfully on at least 1 element with the supplied selector.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('lazyImageObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <div>
                                    This IntersectionObserver is only used to check if a lazy loaded image tag is in
                                    view so that it can load it. If the tag is an image tag, it sets the src of the
                                    image tag once the tag is in view of the user. For all other tags, it sets the
                                    background instead. After this is done, the observer unobserves itself. For now only
                                    images are supported for lazy loading.
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="reveal">
                            Reveal Elements on Scroll Functionality depends on the following functions and properties:
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('initScrollAnimation') !!}
                                    {!! arguments('selector', 'string', '.show-on-scroll') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <hr>
                                <div>
                                    Call this Function in order to Initialize Reveal Animations on a page.
                                    This means that an animation will play on an object every time the element is
                                    visible on screen. Pass an optional element selector that will be used to tell the
                                    function which elements will be animated when the page is scrolled to them. It uses
                                    the <em>revealOnScrollObserver</em> described below to know whether the element to
                                    be animated is in view of the user (i.e it is intersecting with the window). Returns
                                    true if scroll animation was initialized successfully on at least 1 element with the
                                    supplied selector.
                                </div>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('revealOnScrollObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                                <hr>
                                <div>
                                    This IntersectionObserver is only used to check if a scroll reveal element is in
                                    view so that its reveal can be animated. The animation applied is dependent on the
                                    selector passed to the above init function. The observer appends the
                                    <em>is-visible</em> class to the selector element whenever it comes into view and
                                    removes it when it goes away. Animations are applied via CSS for when the elements
                                    have the <em>is-infinite</em> class and when they do not. Infiscroll provides a
                                    sweet default animation for this that is on show in the <a href="{{route('home')}}">scroll</a>
                                    page of this docs. By default, reveal animations are infinitely looping. This means
                                    they will happen each and every time an element is intersecting with the visible
                                    window. To apply reveal animations only once, add a <em>data-infinite</em> attribute
                                    to all relevant elements with a truthy value. This will cause this observer to
                                    unobserve itself after the first reveal occurrence.
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="ajax">
                            The following are DataTable ajax helpers that you can use to make pages with crud
                            functionality:
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('createDataTable') !!}
                                    {
                                    {!! arguments('table', 'string', '#data-table') !!},
                                    {!! arguments('form', 'string', 'form') !!},
                                    {!! arguments('ajax', 'object | string') !!},
                                    {!! arguments('columns', 'Array', '[ ]') !!},
                                    {!! arguments('columnDefs', 'Array', '[ ]') !!},
                                    {!! arguments('etc', 'object', '{ }') !!},
                                    {!! arguments('isCrud', 'boolean', 'true') !!},
                                    {!! arguments('isServerSide', 'boolean', 'true') !!},
                                    {!! arguments('deletableRecords', 'boolean', 'true') !!},
                                    {!! arguments('editableRecords', 'boolean', 'true') !!},
                                    {!! arguments('deleteMarker', 'string', 'suspended') !!}
                                    }
                                    {!! closeFunction() !!}
                                    {!! returnType('DataTable | false') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                    <span class="badge text-light badge-danger">DataTables</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    <i>async</i>
                                    {!! openFunction('addAjax') !!}
                                    {
                                    {!! arguments('form', 'string', 'form') !!},
                                    {!! arguments('url', 'string', "' '") !!},
                                    {!! arguments('dataTable', 'DataTable', 'null') !!},
                                    {!! arguments('formData', 'object', '{ }') !!},
                                    {!! arguments('successMessage', 'string', 'Record Successfully Registered.') !!},
                                    {!! arguments('resetForm', 'boolean', 'true') !!}
                                    }
                                    {!! closeFunction() !!}
                                    {!! returnType(htmlspecialchars('Promise<any>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    <i>async</i>
                                    {!! openFunction('editAjax') !!}
                                    {
                                    {!! arguments('form', 'string', 'form') !!},
                                    {!! arguments('url', 'string', "' '") !!},
                                    {!! arguments('dataTable', 'DataTable', 'null') !!},
                                    {!! arguments('formData', 'object', '{ }') !!},
                                    {!! arguments('successMessage', 'string', 'Record Successfully Updated.') !!},
                                    {!! arguments('resetForm', 'boolean', 'true') !!}
                                    }
                                    {!! closeFunction() !!}
                                    {!! returnType(htmlspecialchars('Promise<any>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    <i>async</i>
                                    {!! openFunction('deleteRestore') !!}
                                    {
                                    {!! arguments('button', 'string | HTMLElement | jQuery', 'button') !!},
                                    {!! arguments('id', 'string | number', " 0 ") !!},
                                    {!! arguments('suspend', 'number | boolean', '1') !!},
                                    {!! arguments('url', 'string', "' '") !!},
                                    {!! arguments('table', 'string', 'table') !!},
                                    {!! arguments('buttonAllHtml', 'string', "' '") !!},
                                    {!! arguments('buttonLoadingHtml', 'string', "' '") !!},
                                    {!! arguments('method', 'string', "DELETE") !!},
                                    {!! arguments('formData', 'object', "{ }") !!},
                                    {!! arguments('successMessage', 'string', '`Record Successfully ${suspend ? "Suspended" : "Restored"}.`') !!}
                                    } = {}
                                    {!! closeFunction() !!}
                                    {!! returnType(htmlspecialchars('Promise<any>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('setEditData') !!}
                                    {
                                    {!! arguments('data', 'object | null', 'null') !!},
                                    {!! arguments('form', 'string', "form") !!},
                                    {!! arguments('scrollToTop', 'boolean', 'true') !!},
                                    }
                                    {!! closeFunction() !!}
                                    {!! returnType('string | false') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('setEditDataPreProcess') !!}
                                    {!! returnType('Function', '() -> true') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('setEditDataPostProcess') !!}
                                    {!! returnType('Function', '() -> true') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableEditButton') !!}
                                    {!! returnType('string', htmlspecialchars('<i class="fas fa-edit"></i> <span class="d-none d-xl-inline">Edit</span>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableNonEditableHtml') !!}
                                    {!! returnType('string', "' '") !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableDeleteButton') !!}
                                    {!! returnType('string', htmlspecialchars('<i class="fas fa-times-circle"></i> <span class="d-none d-xl-inline">Delete</span>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableRestoreButton') !!}
                                    {!! returnType('string', htmlspecialchars('<i class="fas fa-check-circle"></i> <span class="d-none d-xl-inline">Restore</span>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableNonDeletableHtml') !!}
                                    {!! returnType('string', "' '") !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('dataTableButtonLoadingHtml') !!}
                                    {!! returnType('string', htmlspecialchars('<span class="fa fa-spin fa-spinner"></span> <span class="d-none d-xl-inline"> Working</span>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('pageState') !!}
                                    {!! returnType('string', 'add') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonHtmlAdd') !!}
                                    {!! returnType('string', htmlspecialchars('<button type="submit" class="btn btn-success btn-sm">Add</button>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonHtmlEdit') !!}
                                    {!! returnType('string', htmlspecialchars('<button type="submit" class="btn btn-info mr-3 btn-sm">Update</button>')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonHtmlCancel') !!}
                                    {!! returnType('Function', "(() -> { let button = document.createElement('button'); button.className += 'btn btn-danger btn-sm'; button.type = 'button'; button.addEventListener('click', () -> this.setEditData()); button.innerText = 'Cancel'; return button; })") !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('buttonLoadingHtml') !!}
                                    {!! returnType('string', 'Working . . .') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>

                            <h6 class="font-sm"><b>Utility Functions Used</b></h6>
                            <div>
                                <span class="badge badge-light text-muted">makeAjaxRequest</span>
                                <span class="badge badge-light text-muted">toggleButton</span>
                                <span class="badge badge-light text-muted">setToast</span>
                                <span class="badge badge-light text-muted">setFormErrors</span>
                                <span class="badge badge-light text-muted">handleAjaxErrorResponse</span>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="utilities">
                            The following are Utilities that you can use to do various things:
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('makeAjaxRequest') !!}
                                    {
                                    {!! arguments('url', 'string') !!},
                                    {!! arguments('data', 'object', '{ }') !!},
                                    {!! arguments('method', 'string', 'POST') !!},
                                    {!! arguments('object', 'boolean', 'false') !!},
                                    {!! arguments('hasImages', 'boolean', 'false') !!}
                                    }
                                    {!! closeFunction() !!}
                                    {!! returnType(htmlspecialchars('object | Promise<any> | false')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('handleAjaxErrorResponse') !!}
                                    {!! arguments('response', 'any') !!},
                                    {!! arguments('toast', 'boolean', 'false') !!},
                                    {!! arguments('logErrors', 'boolean', 'true') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType(htmlspecialchars('string')) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('setToast') !!}
                                    {!! arguments('options', 'object') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('validToastTypes') !!}
                                    {!! returnType('object', "{ " .
                                        arguments('success', 'string', htmlspecialchars('<strong><i class="fa fa-check-circle"></i> Success: </strong>')) . ", " .
                                        arguments('danger', 'string', htmlspecialchars('<strong><i class="fa fa-times-circle"></i> Error: </strong>')) . ", " .
                                        arguments('info', 'string', htmlspecialchars('<strong><i class="fa fa-info-circle"></i> Info: </strong>')) . ", " .
                                        arguments('warning', 'string', htmlspecialchars('<strong><i class="fa fa-exclamation-circle"></i> Warning: </strong>')) . " }"
                                        ) !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-dark">overridable in constructor</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('toggleButton') !!}
                                    {!! arguments('options', 'object') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <div>
                                    <span class="badge text-light badge-info">jQuery</span>
                                </div>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('setFormErrors') !!}
                                    {!! arguments('errors', 'Array | string | null', 'null') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('boolean') !!}
                                </h6>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('capitalize') !!}
                                    {!! arguments('word', 'string') !!},
                                    {!! arguments('locale', 'string', 'navigator.language') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('string') !!}
                                </h6>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('getClientTimeFromServerTime') !!}
                                    {!! arguments('date', 'string') !!},
                                    {!! arguments('serverTimeZone', 'string | number', '0', true) !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('Moment') !!}
                                </h6>
                                <hr>
                            </div>

                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('stringify') !!}
                                    {!! arguments('data', 'any') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('string') !!}
                                </h6>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('parse') !!}
                                    {!! arguments('data', 'any') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('any') !!}
                                </h6>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openFunction('quotesEscape') !!}
                                    {!! arguments('data', 'any') !!},
                                    {!! arguments('reverse', 'boolean', 'false') !!}
                                    {!! closeFunction() !!}
                                    {!! returnType('any') !!}
                                </h6>
                                <hr>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
@endsection
@push('page-script')
    <script>
    </script>
@endpush
