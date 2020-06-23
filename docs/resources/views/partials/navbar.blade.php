<style>
    @import url('https://fonts.googleapis.com/css2?family=Cookie&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Slab&display=swap');

    .navbar-brand span {
        font-family: 'Cookie', cursive;
        font-size: 1.3em;
    }

    * {
        font-family: 'Roboto', sans-serif;
    }

    nav *, h5, h6, h6 * {
        font-family: 'Roboto Slab', sans-serif;
    }
</style>
<nav class="navbar navbar-expand-sm navbar-dark bg-rose m-2 fixed-top rounded-lg">
    <a class="navbar-brand" href="{{route('home')}}"
       title="An Infinite Scroll Helper!"
       data-content="Comes Complete with Image Lazy Load, Show on Scroll, Toast and Ajax Helpers that are Easily
       Customizable!"
       data-trigger="hover"
       data-placement="bottom"
       data-toggle="popover">
        <img src="https://www.gravatar.com/avatar/{{md5('oboke69@gmail.com')}}?d=robohash&f=y"
             alt="@dopesky" class="img-xs img-thumbnail p-0 rounded-circle">
        <span>InfiScroll</span>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item @if(\Illuminate\Support\Facades\Request::routeIs('docs')) active @endif">
                <a class="nav-link text-uppercase" href="{{route('docs')}}"
                   title="Infiscroll Full Documentation!" data-toggle="tooltip">
                    <i class="fas fa-book"></i> Docs</a>
            </li>
            <li class="nav-item @if(\Illuminate\Support\Facades\Request::routeIs('home')) active @endif">
                <a class="nav-link text-uppercase" href="{{route('home')}}"
                   title="Infinite Scroll Show Case!" data-toggle="tooltip">
                    <i class="fas fa-scroll"></i> Scroll</a>
            </li>
            <li class="nav-item @if(\Illuminate\Support\Facades\Request::routeIs('crud')) active @endif">
                <a class="nav-link text-uppercase" href="{{route('crud')}}"
                   title="Ajax Helpers Show Case!" data-toggle="tooltip">
                    <i class="fas fa-database"></i> Crud</a>
            </li>
        </ul>
    </div>
</nav>
