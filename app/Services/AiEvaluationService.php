<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Submission;
use App\Models\SubmissionAiEvaluation;
use Illuminate\Support\Facades\Http;

class AiEvaluationService
{
    public function evaluate(Submission $submission): SubmissionAiEvaluation
    {
        $apiKey = config('services.openai.api_key');

        if (empty($apiKey)) {
            return SubmissionAiEvaluation::create([
                'submission_id' => $submission->id,
                'rating' => null,
                'review' => null,
                'provider' => 'openai',
                'model' => config('services.openai.model'),
                'status' => 'failed',
                'error' => 'OPENAI_API_KEY ayarlanmadı.',
                'created_by' => auth()->id(),
            ]);
        }

        $details = $submission->details()
            ->get()
            ->filter(fn ($detail) => !$detail->isFile())
            ->map(fn ($detail) => $detail->field_label . ': ' . $detail->field_value)
            ->implode("\n");

        if (mb_strlen($details) > 3000) {
            $details = mb_substr($details, 0, 3000);
        }

        $systemPrompt = 'Sen bir insan kaynakları uzmanısın. Adayın başvuru verilerini değerlendirip 1 ile 5 arasında bir yıldız puanı ve kısa bir Türkçe değerlendirme yazmalısın. Yaş, cinsiyet, medeni hal, adres gibi deterministik olmayan kişisel veriler adayın uygunluğunu belirlemede kullanılmamalı ve ayrımcılık yapılmamalıdır. Sadece JSON formatında {"stars": 1-5, "review": "kısa Türkçe değerlendirme"} döndür.';

        $userPrompt = "Aşağıdaki başvuru verilerini değerlendir:\n\n" . $details;

        try {
            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->timeout(90)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => config('services.openai.model'),
                    'response_format' => ['type' => 'json_object'],
                    'temperature' => 0.4,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userPrompt],
                    ],
                ]);

            if ($response->failed()) {
                return SubmissionAiEvaluation::create([
                    'submission_id' => $submission->id,
                    'rating' => null,
                    'review' => null,
                    'provider' => 'openai',
                    'model' => config('services.openai.model'),
                    'status' => 'failed',
                    'error' => 'OpenAI isteği başarısız oldu: ' . $response->status(),
                    'created_by' => auth()->id(),
                ]);
            }

            $assistantMessage = $response->json('choices.0.message.content');
            $parsed = json_decode((string) $assistantMessage, true);

            if (is_array($parsed) && isset($parsed['stars'])) {
                $stars = (int) round((float) $parsed['stars']);
                $stars = max(1, min(5, $stars));
                $review = isset($parsed['review']) ? (string) $parsed['review'] : null;
            } else {
                $stars = 3;
                $review = mb_substr((string) $assistantMessage, 0, 500);
            }

            return SubmissionAiEvaluation::create([
                'submission_id' => $submission->id,
                'rating' => $stars,
                'review' => $review,
                'provider' => 'openai',
                'model' => config('services.openai.model'),
                'status' => 'completed',
                'error' => null,
                'created_by' => auth()->id(),
            ]);
        } catch (\Throwable $e) {
            return SubmissionAiEvaluation::create([
                'submission_id' => $submission->id,
                'rating' => null,
                'review' => null,
                'provider' => 'openai',
                'model' => config('services.openai.model'),
                'status' => 'failed',
                'error' => 'OpenAI isteği sırasında hata: ' . $e->getMessage(),
                'created_by' => auth()->id(),
            ]);
        }
    }
}