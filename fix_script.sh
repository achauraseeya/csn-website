sed -i '834,$d' src/components/AdminCentralDashboardModal.tsx
cat << 'INNER_EOF' >> src/components/AdminCentralDashboardModal.tsx
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Publish Profile Live To Website Catalog
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Printable PDF Generator Modal */}
      <PrintableApplicationModal
        isOpen={Boolean(printableModalData)}
        onClose={() => setPrintableModalData(null)}
        lang={lang}
        data={printableModalData}
      />
    </>
  );
}
INNER_EOF
bash fix_script.sh
