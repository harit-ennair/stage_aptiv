<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quzs', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('question_text');
            $table->text('question_text')->nullable()->change(); // Allow nullable text for image-only questions
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quzs', function (Blueprint $table) {
            $table->dropColumn('image_path');
            $table->string('question_text')->nullable(false)->change(); // Revert back to required
        });
    }
};
