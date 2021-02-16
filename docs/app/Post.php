<?php

namespace App;

use Database\Factories\PostsFactory;
use Illuminate\Database\Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    use HasFactory;

    protected $table = 'tbl_posts';
    protected $casts = ['suspended' => 'boolean'];

    public function user(): Eloquent\Relations\BelongsTo {
        return $this->belongsTo('App\UserModel', 'user_id', 'user_id');
    }

    protected static function newFactory(): PostsFactory {
        return PostsFactory::new();
    }
}
