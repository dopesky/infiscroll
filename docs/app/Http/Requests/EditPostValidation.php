<?php

namespace App\Http\Requests;

use App\User;
use Illuminate\Foundation\Http\FormRequest;

class EditPostValidation extends FormRequest {
    /**
     * @var User
     */
    public $post;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules() {
        return [
            'id' => ['bail', 'required', 'numeric', function($attr, $value, $fail){
                $this->post = (new User)->find($value);
                if(empty($this->post)){
                    $fail('Post Could Not Be Recognized. Try Again!');
                }
            }],
            'text' => ['bail', 'required', 'max:65535'],
            'image' => ['bail', 'image', 'mimes:jpeg,jpg,png,bmp,gif,svg,webp', 'max:25600'],
        ];
    }
}
