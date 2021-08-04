<p align="center"><img alt="Logo" src="https://res.cloudinary.com/dkgtd3pil/image/upload/e_bgremoval,o_100/v1587389258/other_data/Screenshot_21.png"></p>

## Infiscroll Docs

Infiscroll docs live on [heroku](https://heroku.com) and you can view them [here](https://infiscroll.herokuapp.com).

## Local Setup

The docs are a laravel project. They will need a database, and an environment file. To get started, do:
```$xslt
$ git clone remote directory
$ cd docs
$ composer install
$ cp .env.example .env // update the .env to fit your config
$ php artisan key:generate --ansi
$ php artisan migrate --seed
```

**NB:** Update the .env file to fit your local setup after copying it from .env.example. The .env.example file only contains required environment variables. 

## Contributing

Same contributing guidelines apply here too. When you update the repo remember to document your changes if required. Thanks :)

## Issues

In case of any issues with the docs you can raise an issue [here](https://github.com/dopesky/infiscroll/issues/new) and label it with the `docs` label or follow our contributing guidelines to fix the docs yourself.

## License

Infiscroll Docs is also open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
