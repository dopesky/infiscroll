<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddPostValidation;
use App\Http\Requests\DeletePostValidation;
use App\Http\Requests\EditPostValidation;
use App\Post;
use App\UserModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestController extends Controller {
    function add_post(AddPostValidation $request): JsonResponse {
        $user = UserModel::factory()->create(['username' => $request->post('username')]);
        $post = Post::factory()->create(['text' => $request->post('text'), 'user_id' => $user['user_id']]);
        if (!$post) return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        return response()->json(['ok' => true, 'error' => false]);
    }

    function edit_post(EditPostValidation $request): JsonResponse {
        $post = $request->post;
        $post->text = $request->post('text');
        $post->user_id = $request->user->user_id;
        if ($post->save()) {
            return response()->json(['ok' => true, 'error' => false]);
        } else {
            return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        }
    }

    function delete_restore_post(DeletePostValidation $request): JsonResponse {
        $post = $request->post;
        $post->suspended = !$post->suspended;
        if ($post->save()) {
            return response()->json(['ok' => true, 'error' => false]);
        } else {
            return response()->json(['ok' => false, 'error' => 'An Unexpected Error Occurred. Try Again!']);
        }
    }

    function get_posts(): JsonResponse {
        $data = (new Post)->all()->map(function (Post $post) {
            $post['user'] = $post->user()->first();
            return $post;
        });
        return response()->json(['ok' => true, 'data' => $data]);
    }

    function index(Request $request): JsonResponse {
        $offset = intval($request->post('offset'));
        $size = intval($request->post('size'));
        $previous_new = intval($request->post('newItems'));

        if ($size !== -1) {
            UserModel::factory()->create()->each(function (UserModel $user) {
                $now = now()->format('Y-m-d H:i:s');
                Post::factory()->create(['user_id' => $user->user_id, 'updated_at' => $now]);
            });
        }

        $count = (new Post)->count(); // apply all necessary filters necessary here too
        $new = $size !== -1 && $count > $size ? $count - $size : 0;
        $offset += $new;
        $size = $count;

        if ($request->has('loadNewItems')) {
            $data = $this->map_data_array((new Post)->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->limit($new + $previous_new)->offset(0)->get());
            $response = ['offset' => $offset, 'size' => $size, 'data' => $data, 'newItems' => 0, 'loadNewItems' => true];
        } else {
            $data = $this->map_data_array((new Post)->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->limit(11)->offset($offset)->get());

            $more = count($data) === 11;
            $data = array_slice($data, 0, 10);
            $offset += count($data);
            $response = ['offset' => $offset, 'size' => $size, 'data' => $data, 'hasMoreItems' => $more, 'newItems' => $new + $previous_new];
        }

        return response()->json($response);

    }

    private function map_data_array(Collection $data): array {
        return $data->map(function (Post $post) {
            $post['user'] = $post->user()->first();
            $post['user']['profile'] = "https://www.gravatar.com/avatar/" . md5(strtolower(trim($post['user']['email']))) . "?d=wavatar";
            return $post;
        })->toArray();
    }
}
