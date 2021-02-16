<?php

/** @var Factory $factory */

use App\Post;
use App\UserModel;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Post::class, function (Faker $faker) {
    $array = [[1,1],[3,2],[4,3],[16,9]];
    $image_size = $faker->numberBetween(320, 375);
    $random_index = $faker->numberBetween(0, 3);
    $width = $image_size * $array[$random_index][0];
    $height = $image_size * $array[$random_index][1];
    $date = $faker->date('Y-m-d H:i:s');
    return [
        'user_id' => factory(UserModel::class),
        'text' => implode(' ', $faker->paragraphs()),
        'image' => "c/{$width}x{$height}",
        'updated_at' => $date,
        'created_at' => $date
    ];
});
