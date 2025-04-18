USE gmedia_democase;

CREATE OR REPLACE VIEW v_karyawan_alfiansah_erik_sugiarto AS
SELECT
    nip as Nip,
    nama as Nama,
    alamat as Alamat,
    CASE
      WHEN gend = 'L' THEN 'Laki-laki'
      WHEN gend = 'P' THEN 'Perempuan'
      ELSE 'Tidak Diketahui'
    END as Gend,
    DATE_FORMAT(tgl_lahir, '%d-%m-%Y') as 'Tanggal Lahir',
FROM
    karyawan;