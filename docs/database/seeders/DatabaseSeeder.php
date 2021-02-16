<?php

namespace Database\Seeders;

use App\Post;
use App\UserModel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        UserModel::factory()->count(50)->create()->each(function (UserModel $user) {
            Post::factory()->count(20)->create(['user_id' => $user->user_id]);
        });
    }
}
