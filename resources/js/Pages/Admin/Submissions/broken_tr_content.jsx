                                        <tr key={submission.id}>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/submissions/${submission.id}`}
                                                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                                >
                                                    {submission.applicant_name}
                                                </Link>
                                                <div className="text-xs text-gray-500">{submission.applicant_email}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(submission.created_at).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-900">
                                                {submission.form?.name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                                {submission.form?.department?.title || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {getInvestigationBadge(submission.investigation)}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-500">
                                                {submission.comment_count || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {renderStars(submission.avg_rating)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/submissions/${submission.id}`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                                                        title="Görüntüle"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(submission.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition"
                                                        title="Sil"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>