<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('tbl_posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('text');
            $table->string('image', 255);
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->boolean('suspended')->default(false);

            $table->foreign('user_id')->references('user_id')->on('tbl_users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('tbl_posts');
    }
}
