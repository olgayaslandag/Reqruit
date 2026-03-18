<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray($request): array
    {
        $hasChildren = (bool) ($this->children_count ?? ($this->relationLoaded('children') ? $this->children->count() > 0 : false));
        $hasForm = (bool) ($this->forms_count ?? ($this->relationLoaded('forms') ? $this->forms->count() > 0 : false));

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'has_children' => $hasChildren,
            'has_form' => $hasForm,
            'form' => $this->when(
                $hasForm && $this->relationLoaded('forms') && $this->forms->isNotEmpty(),
                fn () => new FormResource($this->forms->first())
            ),
            'children' => DepartmentResource::collection($this->whenLoaded('children')),
        ];
    }
}
