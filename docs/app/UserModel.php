<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer user_id
 */
class UserModel extends Model {
    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = ['username', 'email'];
    protected $casts = ['suspended' => 'boolean'];

    public function posts(){
        return $this->hasMany('App\User', 'user_id', 'user_id');
    }
}
