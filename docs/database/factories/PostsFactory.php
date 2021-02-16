<?php

namespace Database\Factories;

use App\Post;
use App\UserModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostsFactory extends Factory {
    protected $model = Post::class;

    public function definition(): array {
        $array = [[1, 1], [3, 2], [4, 3], [16, 9]];
        $image_size = $this->faker->numberBetween(320, 375);
        $random_index = $this->faker->numberBetween(0, 3);
        $width = $image_size * $array[$random_index][0];
        $height = $image_size * $array[$random_index][1];
        $date = $this->faker->date('Y-m-d H:i:s');
        return [
            'user_id' => UserModel::factory(),
            'text' => implode(' ', $this->faker->paragraphs()),
            'image' => "https://source.unsplash.com/random/{$width}x{$height}",
            'updated_at' => $date,
            'created_at' => $date
        ];
    }
}
