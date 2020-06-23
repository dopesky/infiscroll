<?php

namespace App\Http\Controllers;

use Cloudinary;
use Cloudinary\Uploader;

class Media extends Controller {
    public function __construct() {
        Cloudinary::config(array("cloud_name" => getenv('CLOUDINARY_CLOUD'), "api_key" => getenv('CLOUDINARY_KEY'), "api_secret" => getenv('CLOUDINARY_SECRET')));
    }

    public function upload_to_cloud($temp_file_name) {
        $result = Uploader::upload($temp_file_name, ["resource_type" => "auto", "folder" => 'infiscroll/']);
        return $result['secure_url'] ?? '';
    }

    public function delete_all_resources() {
        $api = (new Cloudinary\Api);
        try {
            $response = $api->delete_resources_by_prefix('infiscroll/', ['invalidate' => true]);
            return $response['deleted'];
        } catch (Cloudinary\Api\GeneralError $e) {
            return $e->getMessage();
        }
    }
}
