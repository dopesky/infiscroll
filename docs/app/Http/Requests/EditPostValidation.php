<?php

namespace App\Http\Requests;

use App\Post;
use App\UserModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditPostValidation extends FormRequest {
    /**
     * @var Post
     */
    public $post;

    /**
     * @var UserModel
     */
    public $user;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool {
        $this->post = (new Post)->find($this->post('id'));
        return !empty($this->post);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'text' => ['bail', 'required', 'max:65535'],
            'username' => ['bail', 'required', 'min:3', 'alpha_dash', function($attr, $value){
                $this->user = (new UserModel)->where('username', $value)->first();
                if(empty($this->user)){
                    $this->user = UserModel::factory()->create(['username' => $value]);
                }
            }],
        ];
    }
}
