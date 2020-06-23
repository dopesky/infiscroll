<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddPostValidation;
use App\Http\Requests\DeletePostValidation;
use App\Http\Requests\EditPostValidation;
use App\User;
use App\UserModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class TestController extends Controller {
    function add_post(AddPostValidation $request) {
        $image = $request->file('image');
        $post = new User();
        $post->user_id = factory(UserModel::class)->create()->user_id;
        $post->text = $request->post('text');
        $post->image = (new Media)->upload_to_cloud($image->getPathname());
        if ($post->save()) {
            return response()->json(['ok' => true, 'error' => false]);
        } else {
            return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        }
    }

    function edit_post(EditPostValidation $request) {
        $post = $request->post;
        $post->text = $request->post('text');
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $post->image = (new Media)->upload_to_cloud($image->getPathname());
        }
        if ($post->save()) {
            return response()->json(['ok' => true, 'error' => false]);
        } else {
            return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        }
    }

    function delete_restore_post(DeletePostValidation $request) {
        $post = $request->post;
        $post->suspended = !$post->suspended;
        if ($post->save()) {
            return response()->json(['ok' => true, 'error' => false]);
        } else {
            return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        }
    }

    function get_posts() {
        $data = (new User)->all()->map(function (User $post) {
            $post['user'] = $post->user()->first();
            return $post;
        });
        return response()->json(['ok' => true, 'data' => $data]);
    }

    function index(Request $request) {
        $offset = intval($request->post('offset'));
        $size = intval($request->post('size'));
        $previous_new = intval($request->post('newItems'));

        $count = (new User)->count(); // apply all necessary filters necessary here too
        $new = $size !== -1 && $count > $size ? $count - $size : 0;
        $offset += $new;
        $size = $count;

        if ($request->has('loadNewItems')) {
            $data = $this->map_data_array((new User)->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->limit($new + $previous_new)->offset(0)->get());
            $response = ['offset' => $offset, 'size' => $size, 'data' => $data, 'newItems' => 0, 'loadNewItems' => true];
        } else {
            $data = $this->map_data_array((new User)->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->limit(11)->offset($offset)->get());

            $more = count($data) === 11;
            $data = array_slice($data, 0, 10);
            $offset += count($data);
            $response = ['offset' => $offset, 'size' => $size, 'data' => $data, 'hasMoreItems' => $more, 'newItems' => $new + $previous_new];
        }

        return response()->json($response);

    }

    private function map_data_array(Collection $data) {
        return $data->map(function (User $user) {
            $user['user'] = $user->user()->first();
            $user['user']['profile'] = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($user['user']['email']))) . "?d=wavatar";
            return $user;
        })->toArray();
    }
}
