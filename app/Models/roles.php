<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class roles extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}
