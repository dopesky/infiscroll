<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserModelsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->bigIncrements('user_id');
            $table->string('username', 60)->unique();
            $table->string('name', 120)->unique();
            $table->string('email', 60)->unique();
            $table->timestamps();
            $table->boolean('suspended')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('tbl_users');
    }
}
