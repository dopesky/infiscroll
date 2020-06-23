<?php

/** @var Factory $factory */

use App\User;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(User::class, function (Faker $faker) {
    $array = [[1,1],[3,2],[4,3],[16,9]];
    $image_size = $faker->numberBetween(320, 375);
    $random_index = $faker->numberBetween(0, 3);
    $width = $image_size * $array[$random_index][0];
    $height = $image_size * $array[$random_index][1];
    $date = $faker->date('Y-m-d h:i:s');
    return [
        'text' => implode(' ', $faker->paragraphs()),
        'image' => "https://source.unsplash.com/random/{$width}x{$height}",
        'updated_at' => $date,
        'created_at' => $date
    ];
});
