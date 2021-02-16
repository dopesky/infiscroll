<?php

namespace App\Http\Requests;

use App\Post;
use Illuminate\Foundation\Http\FormRequest;

class DeletePostValidation extends FormRequest {
    /**
     * @var Post
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
                $this->post = (new Post)->find($value);
                if(empty($this->post)){
                    $fail('Post Could Not Be Recognized. Try Again!');
                }
            }]
        ];
    }
}
