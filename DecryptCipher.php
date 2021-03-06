<?php

/*
 * Decrypt cipher
 *
 * This is a solution to a 7/2013 HackerRank challenge that took me several hours to complete.
 * The challenge was to decrypt a cipher that arranges the letters of the alphabet that don't appear in the
 * keyword into columns below the letters of a keyword.  For example, we take a keyword "SECRET" (remove
 * duplicate letters) and arrange as follows:
 *
 *     SECRT
 *     ABDFG
 *     HIJKL
 *     MNOPQ
 *     UVWXY
 *     Z
 *
 * And then we sort those columns by the letters in the keyword ("SECRT" is sorted as "CERST"):
 *
 *     Original alphabet:        ABCDE FGHIJ KLMNO PQRSTU VWXYZ
 *     Substitution alphabet:    CDJOW EBINV RFKPX SAHMUZ TGLQY
 *
 * For example, message "JHQSU XFXBQ" is translated as "CRYPT OLOGY".
 *
 */

class Cipher {

    public function DecryptInput() {
        $debug = 0;
        $handle = fopen("php://stdin", "r");
        $test_cases = trim(fgets($handle));
    
        for ($j = 1; $j <= $test_cases; $j++) {
            $keyword = trim(fgets($handle));
            $message = trim(fgets($handle));

            $keyword = $this->RemoveDuplicates($keyword);
            if ($debug) echo $keyword . "\n";
            
            $matrix = $this->BuildAlphabetMatrix($keyword);
            if ($debug) var_dump($matrix);
            
            $newmatrix = $this->TransposeIntoColumns($matrix, $keyword);
            if ($debug) var_dump($newmatrix);
            
            $header_string = $this->SortHeaders($keyword);
            if ($debug) echo $header_string . "\n";
            
            $new_alphabet = $this->CreateNewAlphabet($header_string, $newmatrix);
            if ($debug) echo $new_alphabet . "\n";
            
            $decrypted = $this->Translate($message, $new_alphabet);
            if ($debug) echo $decrypted . "\n";
            
            $this->ShowDecrypted($decrypted);
        }
    }

    private function RemoveDuplicates($word) {
        $length = strlen($word);
        $new_word = "";
        $word_so_far = "";
        for ($j = 0; $j < $length; $j++) {
            $this_char = substr($word, $j, 1);
            if (strpos($word_so_far, $this_char) === false) $new_word .= $this_char;
            $word_so_far .= $this_char;
        }
        return $new_word;
    }
        
    private function BuildAlphabetMatrix($keyword) {
        $length = strlen($keyword);

        // create 1st line of matrix
        $count = 0;
        $matrix = array();
        for ($j = 0; $j < $length; $j++) {
            $this_char = substr($keyword, $j, 1);
            $matrix[0][$count] = $this_char;
            $count++;
        }
    
        // create remaining lines of matrix based on alphabet
        $line = 1;
        $count = 0;
        for ($j = 65; $j <= 90; $j++) {
            $this_char = chr($j);
            if (strpos($keyword, $this_char) === false) {
                $matrix[$line][$count] = $this_char;
                $count++;
            }
            if ($count == $length) {
                $count = 0;
                $line++;
            }
        }
        
        return $matrix;
    }
    
    private function TransposeIntoColumns($matrix, $keyword) {
        $length = strlen($keyword);
        $num_lines = count($matrix);
        $newmatrix = array();
        for ($j = 0; $j < $length; $j++) {
            $this_char = substr($keyword, $j, 1);
            $newmatrix[$this_char] = "";
            for ($l = 0; $l <= $num_lines; $l++) {
                $newmatrix[$this_char] .= $matrix[$l][$j];
            }
        }
        return $newmatrix;
    }
    
    private function SortHeaders($keyword) {
        $length = strlen($keyword);
        $count = 0;
        for ($j = 0; $j < $length; $j++) {
            $this_char = substr($keyword, $j, 1);
            $headers[$count] = $this_char;
            $count++;
        }
        sort($headers);
        $header_string = implode("", $headers);
        return $header_string;
    }
    
    private function CreateNewAlphabet($header_string, $newmatrix) {
        // concatenate sorted columns
        $length = strlen($header_string);
        $new_alphabet = "";
        for ($j = 0; $j < $length; $j++) {
            $this_char = substr($header_string, $j, 1);
            $new_alphabet .= $newmatrix[$this_char];
        }
        return $new_alphabet;
    }
        
    private function Translate($message, $new_alphabet) {
        $decrypted = "";
        $length_message = strlen($message);
        for ($j = 0; $j < $length_message; $j++) {
            $this_char = substr($message, $j, 1);
            if (strpos($new_alphabet, $this_char) === false) {
                $decrypted .= " ";
                continue;
            }
            $position = strpos($new_alphabet, $this_char);
            $decrypted .= chr($position + 65);
        }
        return $decrypted;
    }
    
    private function ShowDecrypted($decrypted) {
        echo $decrypted . "\n";
    }

}

$cipher = new Cipher();
$cipher->DecryptInput();

?>
