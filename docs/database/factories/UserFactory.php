<?php

/** @var Factory $factory */

use App\UserModel;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(UserModel::class, function (Faker $faker) {
    return [
        'username' => $faker->unique()->userName,
        'name' => "$faker->lastName $faker->firstName",
        'email' => $faker->unique()->safeEmail
    ];
});
