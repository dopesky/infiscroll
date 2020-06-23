<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddPostValidation extends FormRequest {
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
            'text' => ['bail', 'required', 'max:65535'],
            'image' => ['bail', 'required', 'image', 'mimes:jpeg,jpg,png,bmp,gif,svg,webp', 'max:25600'],
        ];
    }
}
