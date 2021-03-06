@extends('partials.template')
@section('content')
    <style>
        tr {
            word-break: break-all;
        }
    </style>
    <div class="container-fluid pb-4">
        <div class="row">
            <div class="col-12">
                <h5 class="text-center mt-3"><i class="fas fa-database"></i> Crud Operations via Ajax</h5>
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="card mt-5">
                                <div class="card-header text-center bg-rose mx-auto rounded-lg border-0"
                                     style="margin-top: -2.5rem;width: 80%">
                                    <h4 class="card-title page-title"
                                        data-add="<i class='fas fa-images'></i> Create Post"
                                        data-edit="<i class='fas fa-images'></i> Update Post"></h4>
                                    <small class="card-subtitle page-title" data-add="Add a Post and view it in the Datatable Below or the
                                        Infinite Scroll Page!"
                                           data-edit="Edit a Post that you made before and make it become anything you want!"></small>
                                </div>
                                <div class="card-body pb-0 px-md-5">
                                    <div id="form-errors-container" class="row d-none fadeIn justify-content-center">
                                        <div class="alert alert-danger rounded col-md-8 col-lg-6">
                                            <p><strong><i class="fa fa-times-circle"></i> Error(s):</strong></p>
                                            <div id="form-errors"></div>
                                        </div>
                                    </div>
                                    <form enctype="multipart/form-data" autocomplete="off"
                                          onsubmit="return add_or_edit(event)" class="form-row">
                                        <input type="hidden" name="id">
                                        <div class="form-group col-12">
                                            <label class="input-group">
                                                <span class="input-group-prepend">
                                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                                </span>
                                                <input type="text" class="form-control" placeholder="Username . . ."
                                                       name="username">
                                            </label>
                                        </div>
                                        <div class="form-group col-12">
                                            <label for="text">Description</label>
                                            <textarea name="text" id="text" rows="5"
                                                      class="form-control"></textarea>
                                        </div>
                                        <div class="form-group col-12 d-flex justify-content-end" id="button-div"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <hr>
                    <table id="data-table" class="w-100 table table-striped table-bordered table-hover">
                        <thead class="thead-dark">
                        <tr>
                            <th class="all">Username</th>
                            <th class="desktop w-50">Text</th>
                            <th class="desktop tablet">Image</th>
                            <th class="all">Actions</th>
                        </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="image-modal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body p-0"></div>
            </div>
        </div>
    </div>
@endsection
@push('page-script')
    <script>
        let infiscrollObject = new Infiscroll({
            buttonHtmlAdd: `<button type="submit" class="btn btn-success btn-sm">Make Post</button>`,
            buttonHtmlEdit: `<button type="submit" class="btn btn-info mr-3 btn-sm">Update Post</button>`,
        });
        infiscrollObject.setEditData();
        let imagesObject = {
                get images() {
                    return this.images;
                },
                set images(image) {
                    $('#image-modal .modal-body')
                        .html(`<div style="height: 500px;background: url(${image})" class="background-image"></div>`);
                    $('#image-modal').modal('show');
                }
            },
            ajax = {
                url: `{{route('post.get')}}`,
                object: true,
                method: 'GET'
            },
            dataTable = infiscrollObject.createDataTable({
                ajax: {
                    ...infiscrollObject.makeAjaxRequest(ajax),
                    dataSrc: function (data) {
                        return data.data.map(post => {
                            post['username'] = post.user.username;
                            return post;
                        });
                    },
                },
                columns: [
                    {data: 'username'},
                    {data: 'text'},
                    {data: 'image'},
                    {data: 'id'},
                ],
                columnDefs: [
                    {
                        targets: [0],
                        render: (data) => {
                            return `<span class="text-muted">@${data}</span>`
                        }
                    },
                    {
                        targets: [2],
                        orderable: false,
                        searchable: false,
                        class: 'text-center',
                        render: (data) => {
                            const button = `<button class="btn btn-sm bg-purple"
                                onclick="imagesObject.images = '${data}'">
                            <i class="fa fa-image"></i> <span class="d-none d-md-inline">Image</span></button>`;
                            return `<div class="d-flex justify-content-center">${button}</div>`;
                        }
                    }
                ],
                etc: {
                    buttons: [
                        {
                            extend: 'print',
                            className: 'btn btn-sm bg-rose mr-3',
                            text: `<i class="fas fa-print"></i> Print`
                        },
                        {
                            extend: 'excel',
                            className: 'btn btn-sm bg-purple mr-3',
                            text: `<i class="fas fa-file-excel"></i> Excel`
                        },
                        {
                            extend: 'pdf',
                            className: 'btn btn-sm bg-info border-info',
                            text: `<i class="fas fa-file-pdf"></i> PDF`
                        }
                    ],
                    processing: true,
                    language: {
                        processing: `<i class='spinner-border text-rose font-lg' style="height: 75px;width: 75px"></i>`
                    }
                }
            });

        function add_or_edit(event) {
            event.preventDefault();
            infiscrollObject.addEditAjax({
                url: infiscrollObject.pageState === 'add' ? "{{route('post.post')}}" : "{{route('post.put')}}",
                dataTable,
                formData: {...(infiscrollObject.pageState === 'edit' && {_method: 'PUT'})},
            });
        }
    </script>
@endpush
