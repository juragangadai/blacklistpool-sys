export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      data_register_test: {
        Row: {
          no_pengajuan: string
          tgl_pengajuan: string
          nama_pemohon: string
          alamat_pemohon: string
          stat_rumah: string
          lama_tinggal_thn: number
          lama_tinggal_bln: number
          pekerjaan: string
          nama_tempat_kerja: string
          lama_kerja_thn: number
          lama_kerja_bln: number
          alamatTmpt_kerja: string
          no_hp_wa: string
          no_hp_gsm: string | null
          p_ps: string
          nama_p_ps: string
          alamat_p_ps: string
          stat_rumah_p_ps: string
          lama_tinggal_thn_p_ps: number
          lama_tinggal_bln_p_ps: number
          pekerjaan_p_ps: string
          nama_tempat_kerja_p_ps: string
          lama_kerja_thn_p_ps: number
          lama_kerja_bln_p_ps: number
          alamatTmpt_kerja_p_ps: string
          no_hp_wa_p_ps: string
          no_hp_gsm_p_ps: string | null
          kd1_nama: string
          kd1_hp: string
          kd1_hubungan: string
          kd1_alamat: string
          kd2_nama: string
          kd2_hp: string
          kd2_hubungan: string
          kd2_alamat: string
          pinjaman: number
          angsuran: number
          tenor: number
          merk: string
          type: string
          tahun: string
          warna: string
          nobpkb: string
          bpkban: string
          analisa_cmo: string
          stat_pengajuan: string
          nik_pemohon: string
          nik_p_ps: string
          informasi_blacklist: string | null
          analisa_ca: string | null
          keputusan_ca: string | null
          stat_banding: string | null
          ket_req_banding: string | null
          ket_jwb_banding: string | null
          keputusan_banding: string | null
          row_id: string
          cmo_id: string
          id?: number
          created_at?: string
          updated_at?: string
        }
        Insert: {
          no_pengajuan: string
          tgl_pengajuan?: string
          nama_pemohon?: string
          alamat_pemohon?: string
          stat_rumah?: string
          lama_tinggal_thn?: number
          lama_tinggal_bln?: number
          pekerjaan?: string
          nama_tempat_kerja?: string
          lama_kerja_thn?: number
          lama_kerja_bln?: number
          alamatTmpt_kerja?: string
          no_hp_wa?: string
          no_hp_gsm?: string | null
          p_ps?: string
          nama_p_ps?: string
          alamat_p_ps?: string
          stat_rumah_p_ps?: string
          lama_tinggal_thn_p_ps?: number
          lama_tinggal_bln_p_ps?: number
          pekerjaan_p_ps?: string
          nama_tempat_kerja_p_ps?: string
          lama_kerja_thn_p_ps?: number
          lama_kerja_bln_p_ps?: number
          alamatTmpt_kerja_p_ps?: string
          no_hp_wa_p_ps?: string
          no_hp_gsm_p_ps?: string | null
          kd1_nama?: string
          kd1_hp?: string
          kd1_hubungan?: string
          kd1_alamat?: string
          kd2_nama?: string
          kd2_hp?: string
          kd2_hubungan?: string
          kd2_alamat?: string
          pinjaman?: number
          angsuran?: number
          tenor?: number
          merk?: string
          type?: string
          tahun?: string
          warna?: string
          nobpkb?: string
          bpkban?: string
          analisa_cmo?: string
          stat_pengajuan?: string
          nik_pemohon?: string
          nik_p_ps?: string
          informasi_blacklist?: string | null
          analisa_ca?: string | null
          keputusan_ca?: string | null
          stat_banding?: string | null
          ket_req_banding?: string | null
          ket_jwb_banding?: string | null
          keputusan_banding?: string | null
          row_id?: string
          cmo_id?: string
          id?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          no_pengajuan?: string
          tgl_pengajuan?: string
          nama_pemohon?: string
          alamat_pemohon?: string
          stat_rumah?: string
          lama_tinggal_thn?: number
          lama_tinggal_bln?: number
          pekerjaan?: string
          nama_tempat_kerja?: string
          lama_kerja_thn?: number
          lama_kerja_bln?: number
          alamatTmpt_kerja?: string
          no_hp_wa?: string
          no_hp_gsm?: string | null
          p_ps?: string
          nama_p_ps?: string
          alamat_p_ps?: string
          stat_rumah_p_ps?: string
          lama_tinggal_thn_p_ps?: number
          lama_tinggal_bln_p_ps?: number
          pekerjaan_p_ps?: string
          nama_tempat_kerja_p_ps?: string
          lama_kerja_thn_p_ps?: number
          lama_kerja_bln_p_ps?: number
          alamatTmpt_kerja_p_ps?: string
          no_hp_wa_p_ps?: string
          no_hp_gsm_p_ps?: string | null
          kd1_nama?: string
          kd1_hp?: string
          kd1_hubungan?: string
          kd1_alamat?: string
          kd2_nama?: string
          kd2_hp?: string
          kd2_hubungan?: string
          kd2_alamat?: string
          pinjaman?: number
          angsuran?: number
          tenor?: number
          merk?: string
          type?: string
          tahun?: string
          warna?: string
          nobpkb?: string
          bpkban?: string
          analisa_cmo?: string
          stat_pengajuan?: string
          nik_pemohon?: string
          nik_p_ps?: string
          informasi_blacklist?: string | null
          analisa_ca?: string | null
          keputusan_ca?: string | null
          stat_banding?: string | null
          ket_req_banding?: string | null
          ket_jwb_banding?: string | null
          keputusan_banding?: string | null
          row_id?: string
          cmo_id?: string
          id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
