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

                        function openFunction($functionName){return "<b>$functionName ( </b>";}

                        function openProperty($propertyName){return "<b>$propertyName: </b>";}

                        function closeFunction(){return "<b>)</b>:";}

                        function returnType($type, $default = ''){return "<em class='text-purple'>$type</em>" . ($default ? " = <i>$default</i>" : '');}

                        function arguments($arg, $type, $default = ''){return "<span class='text-rose'>$arg:</span> " . returnType($type, $default);}
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
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('infiniteScrollObject') !!}
                                    {!! returnType('Object', "{ ajax: {}, hasMoreItems: true, newItems: 0, size: -1, offset: 0, fetching: false }") !!}
                                </h6>
                                <hr>
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('infiniteScrollObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <hr>
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
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('lazyImageObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <hr>
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
                            </div>
                            <div class="font-sm border rounded p-2 bg-light my-2">
                                <h6 class="font-sm">
                                    {!! openProperty('revealOnScrollObserver') !!}
                                    {!! returnType('IntersectionObserver') !!}
                                </h6>
                                <hr>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="ajax">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Aliquam
                            animi architecto, aspernatur consectetur enim eveniet ipsa itaque laboriosam, laudantium
                            libero
                            nobis nostrum porro reiciendis rem sed sequi sit, tempora voluptatibus? Lorem ipsum dolor
                            sit
                            amet,
                            consectetur adipisicing elit. At consectetur cum ducimus est eveniet labore, libero maxime
                            necessitatibus neque nesciunt quos sunt totam velit voluptatibus voluptatum! At laudantium
                            provident
                            voluptate. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium distinctio
                            illum
                            labore magnam voluptatum. Blanditiis nulla omnis optio sed sit? Aliquid doloremque itaque
                            laborum,
                            libero obcaecati sint veritatis voluptas voluptates.
                        </div>
                        <div class="tab-pane fade" id="utilities">Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit.
                            Aliquam
                            animi architecto, aspernatur consectetur enim eveniet ipsa itaque laboriosam, laudantium
                            libero
                            nobis nostrum porro reiciendis rem sed sequi sit, tempora voluptatibus? Lorem ipsum dolor
                            sit
                            amet,
                            consectetur adipisicing elit. At consectetur cum ducimus est eveniet labore, libero maxime
                            necessitatibus neque nesciunt quos sunt totam velit voluptatibus voluptatum! At laudantium
                            provident
                            voluptate. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium distinctio
                            illum
                            labore magnam voluptatum. Blanditiis nulla omnis optio sed sit? Aliquid doloremque itaque
                            laborum,
                            libero obcaecati sint veritatis voluptas voluptates.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
@endsection
