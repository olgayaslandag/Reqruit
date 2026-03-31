import { Link } from '@inertiajs/react';

export default function Pagination({ meta, baseUrl }) {
    if (!meta || meta.last_page <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const currentPage = meta.current_page;
        const lastPage = meta.last_page;

        // Her zaman ilk sayfayı göster
        pages.push(1);

        // Sol ellipsis
        if (currentPage > 3) {
            pages.push('...');
        }

        // Sol taraf (mevcut sayfanın 2 öncesi)
        for (let i = Math.max(2, currentPage - 2); i < currentPage; i++) {
            pages.push(i);
        }

        // Mevcut sayfa (1 değilse)
        if (currentPage > 1) {
            pages.push(currentPage);
        }

        // Sağ taraf (mevcut sayfanın 2 sonrası)
        for (let i = currentPage + 1; i <= Math.min(lastPage - 1, currentPage + 2); i++) {
            pages.push(i);
        }

        // Sağ ellipsis
        if (currentPage < lastPage - 2) {
            pages.push('...');
        }

        // Her zaman son sayfayı göster
        if (lastPage > 1) {
            pages.push(lastPage);
        }

        // Benzersiz yap
        return [...new Set(pages)];
    };

    const getPageUrl = (page) => {
        if (typeof page === 'number') {
            const separator = baseUrl.includes('?') ? '&' : '?';
            return `${baseUrl}${separator}page=${page}`;
        }
        return '#';
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted small">
                Toplam <strong>{meta.total}</strong> kayıttan{' '}
                <strong>{meta.from}</strong>-<strong>{meta.to}</strong> arası gösteriliyor
            </div>
            <nav>
                <ul className="pagination pagination-sm mb-0">
                    {/* Previous */}
                    <li className={`page-item ${meta.current_page === 1 ? 'disabled' : ''}`}>
                        <Link
                            href={getPageUrl(meta.current_page - 1)}
                            className="page-link"
                            tabIndex={meta.current_page === 1 ? -1 : undefined}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </Link>
                    </li>

                    {/* Sayfa numaraları */}
                    {pageNumbers.map((page, index) => (
                        <li
                            key={index}
                            className={`page-item ${typeof page === 'number' && page === meta.current_page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                        >
                            {page === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <Link href={getPageUrl(page)} className="page-link">
                                    {page}
                                </Link>
                            )}
                        </li>
                    ))}

                    {/* Next */}
                    <li className={`page-item ${meta.current_page === meta.last_page ? 'disabled' : ''}`}>
                        <Link
                            href={getPageUrl(meta.current_page + 1)}
                            className="page-link"
                            tabIndex={meta.current_page === meta.last_page ? -1 : undefined}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
