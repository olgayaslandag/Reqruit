<?php

class DD_RenderPDF
{
    public function __construct()
    {
        add_action('admin_post_download_submission_pdf', [$this, 'download_submission_pdf']);
    }

    /**
     * PDF indirme endpoint
     */
    public function download_submission_pdf()
    {
        if (!isset($_GET['submission_id'])) {
            wp_die("Submission ID bulunamadı.");
        }

        $submission_id = intval($_GET['submission_id']);

        // HTML hazırla
        $html = $this->render_submission_html($submission_id);

        // PDF oluştur
        $this->generate_pdf($html, "submission-$submission_id.pdf");

        exit;
    }

    /**
     * Dompdf PDF üretim fonksiyonu
     */
    private function generate_pdf($html, $filename)
    {
        if (ob_get_length()) {
            ob_end_clean();
        }

        require_once __DIR__ . '/../libs/dompdf/autoload.inc.php';

        $options = new Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf\Dompdf($options);

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // indir / tarayıcıda aç parametresi
        $download = isset($_GET['download']) ? true : false;

        $dompdf->stream($filename, [
            "Attachment" => $download
        ]);
    }

    /**
     * PDF içine basılacak HTML
     */
    private function render_submission_html($submission_id)
    {
        $details = $this->get_submission_details($submission_id);

        ob_start();
        ?>

        <style>
            @font-face {
                font-family: 'DejaVuSans';
                src: url('<?php echo plugin_dir_url(__FILE__); ?>../libs/dompdf/lib/fonts/DejaVuSans.ttf') format('truetype');
            }
            body {
                font-family: 'DejaVuSans', sans-serif;
                font-size: 14px;
            }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; }
            th { background: #f1f1f1; width: 250px; }
        </style>

        <h1>Başvuru Detayı #<?= $submission_id; ?></h1>

        <table>
            <?php foreach ($details as $label => $value): ?>
            <tr>
                <th><?= esc_html($label); ?></th>
                <td><?= esc_html($value); ?></td>
            </tr>
            <?php endforeach; ?>
        </table>

        <?php
        return ob_get_clean();
    }

    /**
     * Test amaçlı (sen gerçek DB’den çekeceksin)
     */
    private function get_submission_details($submission_id)
    {
        return [
            "Ad Soyad" => "Ali Veli",
            "E-posta"  => "ali@example.com",
            "Mesaj"    => "Merhaba!"
        ];
    }
}