<?php

namespace App;

use Illuminate\Database\Eloquent;

/**
 * @property integer user_id
 * @mixin Eloquent\Builder
 */
class UserModel extends Eloquent\Model {
    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = ['username', 'email'];
    protected $casts = ['suspended' => 'boolean'];

    public function posts() {
        return $this->hasMany('App\Post', 'user_id', 'user_id');
    }
}
