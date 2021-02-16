@extends('partials.template')
@section('content')
    <style>
        #infinite-scroll {
            margin-left: 50%;
        }
    </style>
    <div class="container-fluid">
        <div class="row">
            <div class="offset-sm-3 col-sm-6 offset-md-4 col-md-5 col-lg-4">
                <div id="infinite-scroll-container"></div>
                <span id="infinite-scroll" class="spinner-border text-info spinner-sm"></span>
            </div>
        </div>
    </div>
@endsection
@push('page-script')
    <script>
        let infiscrollObject = new Infiscroll();
        infiscrollObject.initInfiniteScroll('{{route('infinite-scroll')}}', function (response) {
            let data = response.data;
            let container = $('#infinite-scroll-container');
            let isNew = response.loadNewItems;
            if (isNew) response.data.reverse();
            data.forEach(item => {
                let {updated_at} = item;
                let html = `<div class="card my-3 show-on-scroll" id="image-${item.id}">
                    <div class="card-header d-flex align-items-center p-2">
                        <img src="https://res.cloudinary.com/dkgtd3pil/image/upload/v1586261380/other_data/loading.svg"
                            alt="..." data-src="${item.user.profile}" class="rounded-circle mr-2 img-xs">
                        <span class="mr-1 bold">${infiscrollObject.capitalize(item.user.name)}</span>
                        <small class="text-muted">@${infiscrollObject.capitalize(item.user.username)}</small>
                        <button class="ml-auto btn"><i class="fas fa-ellipsis-v"></i></button>
                    </div>
                    <img src="https://res.cloudinary.com/dkgtd3pil/image/upload/v1586261380/other_data/loading.svg"
                        data-src="${item.image}" alt="..." class="card-img-top rounded-0">
                    <div class="card-body">
                        <p class="card-text font-sm">${item.text}</p>
                        <small class="font-xs text-uppercase">${infiscrollObject.getClientTimeFromServerTime(updated_at, 180).fromNow()}</small>
                    </div>
               </div>`;
                if (isNew) {
                    container.prepend(html);
                } else {
                    container.append(html);
                }
                infiscrollObject.initScrollAnimation(`#image-${item.id}`);
                infiscrollObject.initLazyLoading(`#image-${item.id} img`)
            });
            return response;
        });
    </script>
@endpush
