<?php


function get_with_details($submissions)
{
    foreach ($submissions as $sub) {
        $sub->created_at = date('Y-m-d H:i', strtotime($sub->created_at));
        $sub->details = [];

        if (!empty($sub->details_concat)) {

            // Tek tek detayları ayır
            $pairs = explode(';', $sub->details_concat);

            foreach ($pairs as $pair) {

                if (trim($pair) === '') continue;

                // field_name :: field_label :: field_value
                $parts = explode('::', $pair, 3);

                if (count($parts) !== 3) continue;

                $field_name  = $parts[0];
                $field_label = $parts[1];
                $value       = $parts[2];

                // {semicolon} → ; geri çevir
                $value = str_replace('{semicolon}', ';', $value);

                // serialize edilmişse aç
                $value = maybe_unserialize($value);

                $sub->details[] = (object)[
                    'field_name'  => $field_name,
                    'field_label' => $field_label,
                    'field_value' => $value
                ];
            }
        }
    }

    unset($sub->details_concat);
    return $submissions;
}

function get_with_details_single($submission)
{
    if (!$submission) {
        return null;
    }

    $submission->details = [];
    $submission->created_at = date('Y-m-d H:i', strtotime($submission->created_at));

    if (!empty($submission->details_concat)) {

        $pairs = explode(';', $submission->details_concat);

        foreach ($pairs as $pair) {

            if (trim($pair) === '') continue;

            // name :: label :: value
            $parts = explode('::', $pair, 3);
            if (count($parts) !== 3) continue;

            $name  = $parts[0];
            $label = $parts[1];
            $value = $parts[2];

            // {semicolon} → ; geri çevir
            $value = str_replace('{semicolon}', ';', $value);

            // serialize aç
            $value = maybe_unserialize($value);

            $submission->details[] = (object)[
                'field_name'  => $name,
                'field_label' => $label,
                'field_value' => $value
            ];
        }
    }

    unset($submission->details_concat);
    return $submission;
}

function normalize_submission_details($details)
{
    $output = [];

    foreach ($details as $detail) {

        $name  = $detail->field_name;
        $label = $detail->field_label;
        $value = $detail->field_value;

        // Değer array ise formatla
        if (is_array($value)) {
            $value = array_map('esc_html', $value);
            $value = implode(', ', $value);
        } else {
            $value = esc_html($value);
        }

        // Hem label hem value döndür
        $output[$name] = [
            'label' => esc_html($label),
            'value' => $value
        ];
    }

    return $output;
}