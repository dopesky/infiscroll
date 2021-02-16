<?php

namespace Database\Factories;

use App\UserModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory {
    protected $model = UserModel::class;


    public function definition(): array {
        return [
            'username' => $this->faker->unique()->userName,
            'name' => "{$this->faker->lastName} {$this->faker->firstName}",
            'email' => $this->faker->unique()->safeEmail
        ];
    }
}
