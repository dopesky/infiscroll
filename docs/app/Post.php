<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent;

/**
 * Class User
 * @package App
 * @mixin Eloquent\Builder
 * @property integer user_id
 * @property string text
 * @property string image
 * @property bool suspended
 */
class Post extends Eloquent\Model {
    protected $table = 'tbl_posts';
    protected $casts = ['suspended' => 'boolean'];

    public function user(){
        return $this->belongsTo('App\UserModel', 'user_id', 'user_id');
    }
}
