<?php

namespace App;

use Illuminate\Database\Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\UserFactory;

/**
 * @property integer user_id
 * @mixin Eloquent\Builder
 */
class UserModel extends Eloquent\Model {
    use HasFactory;

    protected $table = 'tbl_users';
    protected $primaryKey = 'user_id';
    protected $fillable = ['username', 'email'];
    protected $casts = ['suspended' => 'boolean'];

    public function posts(): Eloquent\Relations\HasMany {
        return $this->hasMany('App\Post', 'user_id', 'user_id');
    }

    protected static function newFactory(): UserFactory {
        return UserFactory::new();
    }
}
