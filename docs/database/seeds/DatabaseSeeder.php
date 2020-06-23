<?php

use App\User;
use App\UserModel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        factory(UserModel::class, 50)->create()->each(function (UserModel $user) {
            factory(User::class, 20)->create(['user_id' => $user->user_id]);
        });
    }
}
