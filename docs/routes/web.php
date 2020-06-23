<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'pages.docs')->name('docs');
Route::view('/scroll', 'pages.welcome')->name('home');
Route::view('/crud', 'pages.crud')->name('crud');
Route::post('/infinite_scroll', 'TestController@index')->name('infinite-scroll');
Route::prefix('post')->name('post.')->group(function () {
    Route::get('', 'TestController@get_posts')->name('get');
    Route::post('', 'TestController@add_post')->name('post');
    Route::put('', 'TestController@edit_post')->name('put');
    Route::delete('', 'TestController@delete_restore_post')->name('delete_restore');
});
