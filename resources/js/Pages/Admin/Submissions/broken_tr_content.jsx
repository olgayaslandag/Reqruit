                                        <tr key={submission.id}>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/submissions/${submission.id}`}
                                                    className="fs-sm fw-medium text-dark hover:text-primary hover:underline"
                                                >
                                                    {submission.applicant_name}
                                                </Link>
                                                <div className="fs-xs text-muted">{submission.applicant_email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-nowrap fs-sm text-muted">
                                                {new Date(submission.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3 fs-xs text-dark">
                                                {submission.form?.name}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap fs-xs text-muted">
                                                {submission.form?.department?.title || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap">
                                                {getInvestigationBadge(submission.investigation)}
                                            </td>
                                            <td className="px-4 py-3 text-center fs-sm text-muted">
                                                {submission.comment_count || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {renderStars(submission.avg_rating)}
                                            </td>
                                            <td className="px-4 py-3 text-nowrap text-right">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Link
                                                        href={`/admin/submissions/${submission.id}`}
                                                        className="p-2 text-info hover:text-info hover:bg-blue-50 rounded"
                                                        title="Görüntüle"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(submission.id)}
                                                        className="p-2 text-danger hover:text-danger hover:bg-red-50 rounded"
                                                        title="Sil"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>