<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddPostValidation extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array {
        return [
            'text' => ['bail', 'required', 'max:65535'],
            'username' => ['bail', 'required', 'min:3', 'alpha_dash', 'unique:tbl_users']
        ];
    }
}
